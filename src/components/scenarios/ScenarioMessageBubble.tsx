import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import HapticNativeTouchable from "../input/button/HapticNativeTouchable";
import { Copy, Languages, Volume2 } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useBottomSheet } from "@/context/BottomSheetContext";
import TranslateBottomSheet from "../translate/TranslateBottomSheet";
import { useCurrentCourse } from "@/hooks/course";
import axios from "axios";
import { useAudioBubble } from "@/context/AudioBubbleContext";
import { useState } from "react";

function ScenarioButton({ icon, onPress }: { icon: any; onPress: () => void }) {
    const colors = useThemeColors();

    const Icon = icon;

    return (
        <HapticNativeTouchable style={styles.btn} onPress={onPress}>
            <Icon size={16} color={colors.textSecondary} />
        </HapticNativeTouchable>
    );
}

export default function ScenarioMessageBubble({
    content,
    userMessage,
    id,
    scenarioId,
    sessionId,
}: {
    content: string;
    userMessage: boolean;
    id: string;
    scenarioId: string;
    sessionId: string;
}) {
    const colors = useThemeColors();
    const { t } = useTranslation();
    const bottomSheet = useBottomSheet();
    const course = useCurrentCourse();
    const audioBubble = useAudioBubble();

    const [audioLoading, setAudioLoading] = useState(false);

    if (!userMessage) {
        return (
            <View style={styles.aiMessage}>
                <ThemedText>{content}</ThemedText>
                <View style={styles.aiBtns}>
                    <ScenarioButton
                        icon={Languages}
                        onPress={() => {
                            bottomSheet.setBottomSheet(
                                <TranslateBottomSheet
                                    fromLanguage={
                                        course.currentCourse!.languageCode
                                    }
                                    toLanguage={
                                        course.currentCourse!.appLanguageCode
                                    }
                                    fromText={content}
                                />
                            );
                        }}
                    />
                    <ScenarioButton
                        icon={Copy}
                        onPress={() => {
                            Clipboard.setStringAsync(content);
                            Toast.show({
                                type: "success",
                                text1: t("copied"),
                            });
                        }}
                    />
                    {audioLoading ? (
                        <ActivityIndicator size={16} />
                    ) : (
                        <ScenarioButton
                            icon={Volume2}
                            onPress={async () => {
                                try {
                                    setAudioLoading(true);

                                    const data = await axios.post(
                                        `/v1/courses/${
                                            course.currentCourse!.id
                                        }/scenarios/${scenarioId}/${sessionId}/messages/${id}/tts`,
                                        {
                                            language:
                                                course.currentCourse!
                                                    .languageCode,
                                        }
                                    );

                                    if (data.status != 200) {
                                        return;
                                    }

                                    audioBubble.setAudioUrl(data.data.url);
                                } catch (e) {
                                    console.error(e);
                                    Toast.show({
                                        type: "error",
                                        text1: t("errors.something_went_wrong"),
                                    });
                                } finally {
                                    setAudioLoading(false);
                                }
                            }}
                        />
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.bubbleWrapper}>
            <View
                style={[
                    styles.bubble,
                    {
                        backgroundColor: colors.card,
                    },
                ]}>
                <ThemedText>{content}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bubbleWrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    bubble: {
        maxWidth: "75%",
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    aiMessage: {
        flexDirection: "column",
        gap: 2,
    },
    aiBtns: {
        flexDirection: "row",
        gap: 4,
    },
    btn: {
        padding: 8,
    },
});
