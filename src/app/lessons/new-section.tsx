import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { usePreventBack } from "@/hooks/navigation";
import useHaptics from "@/hooks/useHaptics";
import { sleep } from "@/utils/util";
import { NotificationFeedbackType } from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NewSectionPage() {
    const { updatedStreak } = useLocalSearchParams<{
        updatedStreak: string;
    }>();

    const streak = updatedStreak === "true";

    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    usePreventBack();

    const haptics = useHaptics();

    const playAnim = useCallback(async () => {
        haptics.notificationAsync(NotificationFeedbackType.Success);

        await sleep(1500);

        if (streak) {
            router.replace("/lessons/streak");
        }
    }, []);

    useEffect(() => {
        playAnim();
    }, []);

    return (
        <ThemedView
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                },
            ]}>
            <View />
            <ThemedText fontWeight="800" style={styles.text}>
                {t("lesson.success.new_section")}
            </ThemedText>
            {streak ? (
                <View />
            ) : (
                <Button style={styles.button} onPress={() => router.back()}>
                    <ButtonText>{t("great")}</ButtonText>
                </Button>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    text: {
        textAlign: "center",
        marginTop: 8,
        fontSize: 24,
    },
    button: {
        marginBottom: 8,
    },
});
