import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { AnimatedThemedText, ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    Easing,
    withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import useHaptics from "@/hooks/useHaptics";
import { sleep } from "@/utils/util";
import { ImpactFeedbackStyle, NotificationFeedbackType } from "expo-haptics";
import LottieView from "lottie-react-native";
import { fireAnimation } from "@/utils/cache/CachedImages";

export default function StreakUpdatePage() {
    const auth = useAuth();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const haptics = useHaptics();

    // Shared values for animations
    const animOpacity = useSharedValue(0);
    const animScale = useSharedValue(0.8);

    const streakOpacity = useSharedValue(0);
    const streakScale = useSharedValue(0.8);

    const streakDescOpacity = useSharedValue(0);
    const streakDescScale = useSharedValue(0.8);

    const buttonOpacity = useSharedValue(0);

    const jumpingAnimOptions = {
        duration: 1000,
        easing: Easing.out(Easing.exp),
    };

    const playAnim = useCallback(async () => {
        haptics.successVibration();

        await sleep(1500);

        animOpacity.value = withTiming(1, jumpingAnimOptions);
        animScale.value = withTiming(1, jumpingAnimOptions);

        await sleep(200);

        streakOpacity.value = withTiming(1, jumpingAnimOptions);
        streakScale.value = withTiming(1, jumpingAnimOptions);
        haptics.impactAsync(ImpactFeedbackStyle.Heavy);

        await sleep(500);

        streakDescOpacity.value = withTiming(1, jumpingAnimOptions);
        streakDescScale.value = withTiming(1, jumpingAnimOptions);

        await sleep(1000);

        buttonOpacity.value = withTiming(1, {
            duration: 500,
        });
        haptics.notificationAsync(NotificationFeedbackType.Success);
    }, [streakOpacity, streakScale]);

    useEffect(() => {
        // Update streak data
        // @ts-ignore
        auth.setUser({
            ...auth.user,
            streak: {
                current: (auth.user?.streak?.current ?? 0) + 1,
                lastDate: new Date().toISOString(),
                longest: Math.max(
                    auth.user?.streak?.longest ?? 0,
                    (auth.user?.streak?.current ?? 0) + 1
                ),
            },
        });

        playAnim();
    }, []);

    return (
        <ThemedView
            style={[
                styles.page,
                {
                    paddingTop: insets.top + 16,
                    paddingBottom: insets.bottom + 16,
                },
            ]}>
            <View style={styles.textContainer}>
                <Animated.View
                    style={{
                        opacity: animOpacity,
                        transform: [
                            {
                                scale: animScale,
                            },
                        ],
                    }}>
                    <LottieView
                        autoPlay
                        style={styles.animation}
                        source={fireAnimation}
                    />
                </Animated.View>
                <AnimatedThemedText
                    fontWeight="800"
                    style={[
                        styles.streakText,
                        {
                            fontSize: 36,
                            opacity: streakOpacity,
                            transform: [
                                {
                                    scale: streakScale,
                                },
                            ],
                        },
                    ]}>
                    {t("streak.streakUpdated")}
                </AnimatedThemedText>
                <AnimatedThemedText
                    type="secondary"
                    style={[
                        styles.streakText,
                        {
                            opacity: streakDescOpacity,
                            transform: [
                                {
                                    scale: streakDescScale,
                                },
                            ],
                        },
                    ]}>
                    {t("streak.streakUpdatedDescription", {
                        count: auth.user?.streak?.current ?? 0,
                    })}
                </AnimatedThemedText>
            </View>
            <Animated.View style={{ width: "100%", opacity: buttonOpacity }}>
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
    page: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    streakText: {
        textAlign: "center",
    },
    animation: {
        width: 200,
        height: 200,
        alignSelf: "center",
        marginBottom: 16,
    },
});
