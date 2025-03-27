import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import {
    AIScenarioMessage,
    useScenario,
    useScenarios,
} from "@/context/ScenariosContext";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { getPlatformHeaderHeight } from "@/utils/util";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScenarioChatHeader from "@/components/scenarios/ScenarioChatHeader";
import axios from "axios";
import { useCurrentCourse } from "@/hooks/course";
import ScenarioMessageBubble from "@/components/scenarios/ScenarioMessageBubble";
import MessageInput from "@/components/homescreen/chats/MessageInput";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useAudioBubble } from "@/context/AudioBubbleContext";

type MessageType =
    | AIScenarioMessage
    | {
          userMessage: true;
          content: string;
          tmpId: string;
      };

export default function ScenarioChatPage(props: any) {
    const { id, sessionId } = useLocalSearchParams<{
        id: string;
        sessionId: string;
    }>();

    const insets = useSafeAreaInsets();
    const scenario = useScenario(id);
    const scenarios = useScenarios();
    const kbHeight = useKeyboardHeight(false);
    const course = useCurrentCourse();
    const { t } = useTranslation();
    const colors = useThemeColors();
    const audioBubble = useAudioBubble();

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const msgRef = useRef<MessageType[]>([]);
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [success, setSuccess] = useState(false);
    const [lazyLoading, setLazyLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchMessages = useCallback(async () => {
        if (!course.currentCourse || !scenario) return;

        try {
            const resp = await axios.get(
                `/v1/courses/${course.currentCourse.id}/scenarios/${id}/${sessionId}/messages`
            );

            if (resp.status != 200) {
                throw new Error("Failed to fetch messages");
            }

            const msgs = resp.data.scenario.messages;
            setMessages(msgs);
            setDone(resp.data.scenario.completed);
            setSuccess(resp.data.scenario.success);
            msgRef.current = msgs;
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }, [sessionId]);

    const fetchMoreMessages = useCallback(async () => {
        if (!course.currentCourse || !scenario) return;
        if (lazyLoading || loading || !hasMore) return;

        setLazyLoading(true);

        try {
            let lastId;

            // go from last message and find one which has an ID
            for (let i = messages.length - 1; i >= 0; i--) {
                if ("id" in messages[i]) {
                    // @ts-ignore
                    lastId = messages[i].id;
                    break;
                }
            }

            const resp = await axios.get(
                `/v1/courses/${course.currentCourse.id}/scenarios/${id}/${sessionId}/messages`,
                {
                    params: {
                        offset: lastId,
                    },
                }
            );

            if (resp.status != 200) {
                throw new Error("Failed to fetch messages");
            }

            const msgs = resp.data.scenario.messages;
            msgRef.current = [...msgRef.current, ...msgs];
            setMessages(msgRef.current);
            setHasMore(msgs.length > 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLazyLoading(false);
        }
    }, [sessionId, messages]);

    useEffect(() => {
        fetchMessages();
    }, []);

    if (!scenario || !course.currentCourse) {
        return (
            <ThemedView style={styles.flexFill}>
                <StatusBar style="auto" />
                <ThemedText>Scenario not found</ThemedText>
                <Button onPress={() => router.back()}>
                    <ButtonText>back</ButtonText>
                </Button>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.flexFill}>
            <StatusBar style="auto" />
            <ScenarioChatHeader {...scenario} />
            {loading ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <ActivityIndicator />
                </View>
            ) : (
                <Animated.FlatList
                    onEndReached={fetchMoreMessages}
                    inverted
                    contentContainerStyle={{
                        paddingBottom:
                            insets.top + getPlatformHeaderHeight() + 16,
                        paddingTop: insets.bottom + 16 + 16 + 96,
                        paddingHorizontal: 16,
                        flexGrow: 1,
                        justifyContent: "flex-end",
                        gap: 16,
                    }}
                    style={{
                        paddingTop: kbHeight,
                    }}
                    data={[
                        {
                            _internal_sending: sending,
                        },
                        ...messages,
                    ]}
                    keyExtractor={(item) =>
                        "_internal_sending" in item
                            ? "sending"
                            : "tmpId" in item
                            ? item.tmpId
                            : item.id
                    }
                    renderItem={({ item }) => {
                        if ("_internal_sending" in item) {
                            if (item._internal_sending) {
                                return <ActivityIndicator />;
                            }
                            return null;
                        }

                        return (
                            <ScenarioMessageBubble
                                scenarioId={scenario.id}
                                sessionId={scenario.session_id as string}
                                id={"tmpId" in item ? item.tmpId : item.id}
                                content={item.content}
                                userMessage={item.userMessage}
                            />
                        );
                    }}
                />
            )}
            {done ? (
                <View
                    style={[
                        styles.completedContainer,
                        {
                            bottom: 0,
                            paddingBottom: insets.bottom + 16,
                            height: 96 + insets.bottom + 16,
                            borderTopWidth: 1,
                            borderColor: colors.outline,
                            backgroundColor: colors.background,
                        },
                    ]}>
                    <ThemedText
                        style={{
                            textAlign: "center",
                            color: success ? colors.correct : colors.error,
                        }}>
                        {success
                            ? t("scenarios.success")
                            : t("scenarios.failure")}
                    </ThemedText>
                </View>
            ) : (
                <MessageInput
                    disableSending={sending}
                    onSend={async (content, shouldReason, audioMode) => {
                        setSending(true);

                        const tmpId = Date.now().toString();

                        setMessages([
                            {
                                userMessage: true,
                                content,
                                tmpId,
                            },
                            ...messages,
                        ]);

                        try {
                            const resp = await axios.post(
                                `/v1/courses/${course.currentCourse.id}/scenarios/${id}/${sessionId}/messages`,
                                {
                                    content,
                                    use_reasoning: shouldReason,
                                    auto_tts: audioMode,
                                }
                            );

                            if (resp.data.scenario.completed) {
                                setSuccess(resp.data.scenario.success);
                                setDone(true);
                                setSending(false);

                                scenarios.setState((prev) => {
                                    return {
                                        ...prev,
                                        scenarios: prev.scenarios.map((s) => {
                                            if (s.id === id) {
                                                return {
                                                    ...s,
                                                    completed: true,
                                                    success:
                                                        resp.data.scenario
                                                            .success,
                                                };
                                            }

                                            return s;
                                        }),
                                    };
                                });

                                router.replace(
                                    `/scenarios/${id}/success?updatedStreak=${resp.data.updatedStreak}`
                                );

                                return;
                            }

                            if (audioMode && resp.data.ttsUrl) {
                                audioBubble.setAudioUrl(resp.data.ttsUrl);
                            }

                            const data = resp.data.scenario.messages;

                            msgRef.current = [...data, ...msgRef.current];
                            setMessages(msgRef.current);
                        } catch (e) {
                            console.error(e);

                            Toast.show({
                                type: "error",
                                text1: t("errors.something_went_wrong"),
                            });
                        } finally {
                            setSending(false);
                        }
                    }}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    flexFill: {
        flex: 1,
    },
    completedContainer: {
        position: "absolute",
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 96,
    },
});
