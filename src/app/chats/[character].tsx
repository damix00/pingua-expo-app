import { apiConfig } from "@/api/config";
import { getJwt } from "@/api/data";
import ChatBubble from "@/components/homescreen/chats/ChatBubble";
import MessageInput from "@/components/homescreen/chats/MessageInput";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { Chat, chatCharacters, useChat, useChats } from "@/context/ChatContext";
import { useCurrentCourse } from "@/hooks/course";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { useThemeColors } from "@/hooks/useThemeColor";
import axios from "axios";
import { useNetworkState } from "expo-network";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import Animated, {
    LinearTransition,
    useAnimatedStyle,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { fetch as expoFetch } from "expo/fetch"; // Import the polyfilled expo fetch
import { Ellipsis } from "lucide-react-native";

export default function ChatScreen() {
    const colors = useThemeColors();
    const { character: charName } = useLocalSearchParams<{
        character: string;
    }>();
    const { t } = useTranslation();

    const character = chatCharacters[charName as keyof typeof chatCharacters];

    const keyboardHeight = useKeyboardHeight();
    const insets = useAppbarSafeAreaInsets();
    const chat = useChat(charName);
    const chats = useChats();
    const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
    const networkState = useNetworkState();
    const [loading, setLoading] = useState(false);
    const messagesRef = useRef<Chat["messages"]>(chat?.messages || []);
    const [lazyLoading, setLazyLoading] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);

    const animatedListPadding = useAnimatedStyle(
        () => ({
            // Padding top because the list is inverted
            paddingTop: keyboardHeight.value + insets.bottom + 24 + 8,
        }),
        [keyboardHeight, insets]
    );
    const course = useCurrentCourse();

    const fetchData = useCallback(async () => {
        try {
            // Try to fetch chat data
            const data = await axios.get("/v1/chats", {
                params: {
                    character: charName,
                },
            });

            if (data.status == 200) {
                // @ts-ignore
                chats.setChats((prev) => [...prev, data.data.chat]);
                messagesRef.current = data.data.chat.messages;
                return;
            }

            // If chat not found, create a new one
            const created = await axios.post("/v1/chats", {
                character: charName,
            });

            if (created.status == 201) {
                // @ts-ignore
                chats.setChats((prev) => [...prev, created.data.chat]);
                messagesRef.current = [];
                return;
            }
        } catch (error) {
            // If chat creation failed, show an error
            console.error(error);
            Toast.show({
                type: "error",
                text1: t("errors.failed_to_create_chat"),
                text2: t("errors.something_went_wrong"),
            });
        }
    }, []);

    const fetchMore = useCallback(async () => {
        if (chat && !loading && !lazyLoading && !reachedEnd) {
            const last = chat.messages.findLast((msg) => msg.id);

            setLazyLoading(true);

            const data = await axios.get(`/v1/chats/`, {
                params: {
                    character: charName,
                    last: last?.id || null,
                },
            });

            if (data.status == 200) {
                const messages = data.data.chat.messages;

                if (messages.length == 0) {
                    setReachedEnd(true);
                }

                const newMessages = [...chat.messages, ...messages];

                // Remove duplicates by id
                const uniqueMessages = newMessages.filter(
                    (msg, index, self) =>
                        self.findIndex((m) => m.id === msg.id) === index
                );

                const updatedChat = {
                    ...chat,
                    messages: uniqueMessages,
                };

                messagesRef.current = updatedChat.messages;

                chats.updateChat(updatedChat);
            }

            setLazyLoading(false);
        }
    }, [chat, loading, lazyLoading, reachedEnd]);

    useEffect(() => {
        if (networkState.isConnected && !chat) {
            // Fetch chat data
            fetchData();
        }
    }, [networkState.isConnected]);

    if (!character) {
        return (
            <ThemedView style={styles.centered}>
                <ThemedText>{t("errors.something_went_wrong")}</ThemedText>
            </ThemedView>
        );
    }

    if (!chat) {
        return (
            <ThemedView style={styles.centered}>
                <ActivityIndicator color={colors.primary} size="large" />
            </ThemedView>
        );
    }

    return (
        <View
            style={[
                styles.page,
                {
                    backgroundColor: colors.background,
                },
            ]}>
            <Animated.FlatList
                initialNumToRender={20}
                inverted
                onEndReached={fetchMore}
                onEndReachedThreshold={0.3} // % from the end because list is inverted
                contentContainerStyle={[
                    styles.contentContainer,
                    {
                        paddingTop:
                            Platform.OS == "android" ? insets.bottom : 0,
                        paddingBottom:
                            Platform.OS == "android"
                                ? insets.top * 2
                                : insets.top,
                    },
                ]}
                showsVerticalScrollIndicator={false}
                style={[styles.list, animatedListPadding]}
                data={[
                    ...loadingMessages,
                    ...chat.messages,
                    ...(lazyLoading
                        ? [
                              {
                                  _internal_loading: true,
                              },
                          ]
                        : []),
                ]}
                numColumns={1}
                renderItem={({ item }) => {
                    if (
                        typeof item == "object" &&
                        "_internal_loading" in item
                    ) {
                        return (
                            <ActivityIndicator
                                style={styles.loader}
                                color={colors.primary}
                            />
                        );
                    }

                    if (typeof item === "string") {
                        return (
                            <ChatBubble
                                messageId="loading"
                                chatId={chat.id}
                                loading
                                content={item}
                                userMessage
                            />
                        );
                    }

                    return (
                        <ChatBubble
                            messageId={item.id}
                            chatId={chat.id}
                            content={item.content}
                            userMessage={item.userMessage}
                            onDelete={async () => {
                                const resp = await axios.delete(
                                    `/v1/chats/${chat.id}/messages/${item.id}`
                                );

                                if (resp.status != 204) {
                                    Toast.show({
                                        type: "error",
                                        text1: t("errors.something_went_wrong"),
                                    });
                                    return;
                                }

                                const filtered = messagesRef.current.filter(
                                    (msg) => msg.id !== item.id
                                );

                                const updatedChat = {
                                    ...chat,
                                    lastMessage: filtered[0],
                                    messages: filtered,
                                };

                                messagesRef.current = updatedChat.messages;

                                chats.updateChat(updatedChat);
                            }}
                        />
                    );
                }}
                initialScrollIndex={0}
                keyExtractor={(item, index) =>
                    typeof item === "string"
                        ? item + index
                        : "_internal_loading" in item
                        ? "loading"
                        : item.id
                }
            />
            <View style={styles.input}>
                <MessageInput
                    onSend={async (message) => {
                        if (message.trim() == "") {
                            return;
                        }
                        setLoadingMessages((prev) => [message, ...prev]);
                        setLoading(true);

                        // Have to use fetch because axios doesn't support streaming
                        const resp = await expoFetch(
                            `${apiConfig.baseUrl}/v1/chats/${chat.id}/messages`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-Accel-Buffering": "no",
                                    Authorization: getJwt(),
                                },
                                body: JSON.stringify({
                                    content: message,
                                    language: course.currentCourse.languageCode,
                                }),
                            }
                        );

                        const stream = resp.body?.getReader();

                        if (!stream) {
                            setLoading(false);
                            return;
                        }

                        while (true) {
                            const { done, value } = await stream.read();

                            if (done) {
                                setLoading(false);
                                break;
                            }

                            try {
                                const chunk = new TextDecoder().decode(value);

                                const parsed = JSON.parse(chunk);

                                if (parsed?.sent) {
                                    setLoadingMessages((prev) =>
                                        prev.filter((msg) => msg !== message)
                                    );

                                    const newMessage = {
                                        id: parsed.id,
                                        chatId: chat.id,
                                        userMessage: true,
                                        content: message,
                                        createdAt: new Date(),
                                        attachments: [],
                                    };

                                    const updatedChat = {
                                        ...chat,
                                        lastMessage: newMessage,
                                        messages: [
                                            newMessage,
                                            ...messagesRef.current,
                                        ],
                                    };

                                    messagesRef.current = updatedChat.messages;

                                    chats.updateChat(updatedChat);
                                } else if (parsed?.content) {
                                    const newMessage = {
                                        tmp: true,
                                        id: Math.random().toString(),
                                        chatId: chat.id,
                                        userMessage: false,
                                        content: parsed.content,
                                        createdAt: new Date(),
                                        attachments: [],
                                    };

                                    const updatedChat = {
                                        ...chat,
                                        messages: [
                                            newMessage,
                                            ...messagesRef.current,
                                        ],
                                    };

                                    messagesRef.current = updatedChat.messages;

                                    chats.updateChat(updatedChat);
                                } else if (parsed?.finished) {
                                    const messages = parsed.messages;

                                    const updatedChat = {
                                        ...chat,
                                        lastMessage: messages[0],
                                        messages: [
                                            ...messages,
                                            ...messagesRef.current.filter(
                                                // @ts-ignore
                                                (msg) => !msg.tmp
                                            ),
                                        ],
                                    };

                                    chats.updateChat(updatedChat);
                                }
                            } catch (e) {
                                console.error(e);
                            }
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        flexGrow: 1,
    },
    list: {
        paddingHorizontal: 16,
    },
    input: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        zIndex: 1,
    },
    contentContainer: {
        gap: 8,
        flexGrow: 1,
        paddingTop: Platform.OS == "android" ? 8 : 0,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loader: {
        paddingVertical: 24,
    },
});
