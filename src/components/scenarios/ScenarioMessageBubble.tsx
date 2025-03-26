import { StyleSheet, View } from "react-native";
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
}: {
    content: string;
    userMessage: boolean;
    id: string;
}) {
    const colors = useThemeColors();
    const { t } = useTranslation();
    const bottomSheet = useBottomSheet();
    const course = useCurrentCourse();

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
                    <ScenarioButton icon={Volume2} onPress={() => {}} />
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
