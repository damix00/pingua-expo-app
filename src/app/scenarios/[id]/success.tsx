import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ui/ThemedText";
import { sleep } from "@/utils/util";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useHaptics from "@/hooks/useHaptics";
import { ImpactFeedbackStyle, NotificationFeedbackType } from "expo-haptics";
import Button from "@/components/input/button/Button";
import { router, useLocalSearchParams } from "expo-router";
import ButtonText from "@/components/input/button/ButtonText";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import { highFiveAnimation } from "@/utils/cache/CachedImages";

export default function ScenarioSuccessPage() {
    const { updatedStreak } = useLocalSearchParams<{
        updatedStreak: string;
    }>();

    const streak = updatedStreak === "true";

    const insets = useSafeAreaInsets();
    const haptics = useHaptics();
    const { t } = useTranslation();

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    const btnOpacity = useSharedValue(0);
    const animation = useRef<LottieView>(null);

    const animate = useCallback(async () => {
        haptics.successVibration();

        await sleep(1500);

        animation.current?.play();

        opacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });
        scale.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });

        haptics.impactAsync(ImpactFeedbackStyle.Heavy);

        if (streak) {
            await sleep(1500);
            router.replace("/lessons/streak");
        } else {
            await sleep(1000);
            btnOpacity.value = withTiming(1, {
                duration: 1000,
                easing: Easing.out(Easing.exp),
            });

            haptics.notificationAsync(NotificationFeedbackType.Success);
        }
    }, []);

    useEffect(() => {
        animate();
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <ThemedView
            style={[
                styles.page,
                {
                    paddingTop: insets.top + 16,
                    paddingBottom: insets.bottom + 16,
                },
            ]}>
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}>
                <LottieView
                    autoPlay={false}
                    ref={animation}
                    style={styles.animation}
                    source={highFiveAnimation}
                />
                <ThemedText
                    fontWeight="800"
                    style={{
                        fontSize: 32,
                    }}>
                    {t("scenarios.success")}
                </ThemedText>
            </Animated.View>
            {streak ? (
                <View />
            ) : (
                <Animated.View style={[{ opacity: btnOpacity }, styles.btn]}>
                    <Button
                        onPress={async () => {
                            router.back();
                        }}>
                        <ButtonText>{t("great")}</ButtonText>
                    </Button>
                </Animated.View>
            )}
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
    btn: {
        width: "100%",
    },
    animation: {
        width: 200,
        height: 200,
        alignSelf: "center",
        marginBottom: 16,
    },
});
