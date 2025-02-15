import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import useHaptics from "@/hooks/useHaptics";
import { NotificationFeedbackType } from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LessonSuccessPage() {
    const { xp } = useLocalSearchParams<{
        xp: string;
    }>();

    const insets = useSafeAreaInsets();
    const haptics = useHaptics();

    const { t } = useTranslation();

    const opacity1 = useSharedValue(0);
    const opacity2 = useSharedValue(0);
    const opacity3 = useSharedValue(0);
    const opacity4 = useSharedValue(0);

    const duration = 500;

    useEffect(() => {
        opacity1.value = withTiming(1, { duration });
        setTimeout(() => {
            opacity2.value = withTiming(1, { duration });
        }, 1000);
        setTimeout(() => {
            haptics.notificationAsync(NotificationFeedbackType.Success);
            opacity3.value = withTiming(1, { duration });
        }, 2000);
        setTimeout(() => {
            opacity4.value = withTiming(1, { duration });
        }, 2500);
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
            <View style={styles.textContainer}>
                <Animated.View style={[{ opacity: opacity1 }, styles.item]}>
                    <ThemedText type="heading">
                        {t("lesson.success.title")}
                    </ThemedText>
                </Animated.View>
                <Animated.View style={[{ opacity: opacity2 }, styles.item]}>
                    <ThemedText type="secondary">
                        {t("lesson.success.description")}
                    </ThemedText>
                </Animated.View>
                <Animated.View style={[{ opacity: opacity3 }, styles.item]}>
                    <ThemedText fontWeight="800" style={styles.xp}>
                        {t("lesson.success.xp", { xp })}
                    </ThemedText>
                </Animated.View>
            </View>
            <Animated.View
                style={[{ opacity: opacity4 }, styles.item, styles.button]}>
                <Button
                    onPress={() => {
                        router.back();
                    }}>
                    <ButtonText>{t("great")}</ButtonText>
                </Button>
            </Animated.View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        flexDirection: "column",
    },
    item: {
        flexDirection: "row",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    button: {
        marginTop: 24,
        marginBottom: 8,
    },
    xp: {
        fontSize: 48,
        marginTop: 12,
    },
});
