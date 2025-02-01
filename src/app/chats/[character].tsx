import ChatBubble from "@/components/homescreen/chats/ChatBubble";
import MessageInput from "@/components/homescreen/chats/MessageInput";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { Chat, chatCharacters, useChat, useChats } from "@/context/ChatContext";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { useThemeColors } from "@/hooks/useThemeColor";
import axios from "axios";
import { useNetworkState } from "expo-network";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    LinearTransition,
    useAnimatedStyle,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

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

    const animatedListPadding = useAnimatedStyle(
        () => ({
            // Padding top because the list is inverted
            paddingTop: keyboardHeight.value + insets.bottom + 24 + 8,
        }),
        [keyboardHeight, insets]
    );

    const fetchData = async () => {
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
                return;
            }

            // If chat not found, create a new one
            const created = await axios.post("/v1/chats", {
                character: charName,
            });

            if (created.status == 201) {
                // @ts-ignore
                chats.setChats((prev) => [...prev, created.data.chat]);
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
    };

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
                inverted
                contentInset={{ bottom: insets.top }}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                style={[styles.list, animatedListPadding]}
                data={[...chat.messages, ...loadingMessages]}
                numColumns={1}
                renderItem={({ item }) => {
                    if (typeof item === "string") {
                        return (
                            <ChatBubble loading content={item} userMessage />
                        );
                    }

                    return (
                        <ChatBubble
                            content={item.content}
                            userMessage={item.userMessage}
                        />
                    );
                }}
                itemLayoutAnimation={LinearTransition}
                initialScrollIndex={0}
                keyExtractor={(item, index) =>
                    typeof item === "string" ? item + index : item.id
                }
            />
            <View style={styles.input}>
                <MessageInput
                    onSend={(message) => {
                        setLoadingMessages((prev) => [...prev, message]);
                        axios
                            .post("/v1/chats/messages", {
                                chatId: chat.id,
                                content: message,
                            })
                            .then((response) => {
                                if (response.status == 201) {
                                    setLoadingMessages((prev) =>
                                        prev.filter((m) => m !== message)
                                    );
                                }
                            });
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    list: {
        flex: 1,
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
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
