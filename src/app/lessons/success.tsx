import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useCurrentCourse } from "@/hooks/course";
import useHaptics from "@/hooks/useHaptics";
import { clappingAnimation } from "@/utils/cache/CachedImages";
import { saveUserCache } from "@/utils/cache/user-cache";
import { sleep } from "@/utils/util";
import axios from "axios";
import { ImpactFeedbackStyle, NotificationFeedbackType } from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LessonSuccessPage() {
    const { xp, advancedToNextSection, updatedStreak } = useLocalSearchParams<{
        xp: string;
        advancedToNextSection: string;
        updatedStreak: string;
    }>();

    const advanced = advancedToNextSection === "true";
    const streak = updatedStreak === "true";

    const insets = useSafeAreaInsets();
    const haptics = useHaptics();
    const currentCourse = useCurrentCourse();

    const auth = useAuth();

    const { t } = useTranslation();

    const animOpacity = useSharedValue(0);

    const opacity1 = useSharedValue(0);
    const scale1 = useSharedValue(0.8);
    const opacity2 = useSharedValue(0);
    const opacity3 = useSharedValue(0);
    const opacity4 = useSharedValue(0);

    const duration = 500;

    const loadNewSection = useCallback(async () => {
        if (!advanced) {
            return;
        }

        const me = await axios.get("/v1/auth/me");

        console.log(me.data);

        auth.setCourses(me.data.courses);
        auth.setSectionData(me.data.section_data);
        auth.setSectionCount(me.data.section_count);

        await saveUserCache({
            user: me.data.user,
            courses: me.data.courses,
            sectionData: me.data.sectionData,
        });
    }, []);

    const playAnim = useCallback(async () => {
        // Start the haptics feedback in parallel
        haptics.successVibration();

        await sleep(1000);
        animOpacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });
        await sleep(200);

        opacity1.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });
        scale1.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });
        haptics.impactAsync(ImpactFeedbackStyle.Medium);
        await sleep(1000);
        opacity2.value = withTiming(1, { duration });
        haptics.impactAsync(ImpactFeedbackStyle.Heavy);

        await sleep(1000);
        haptics.notificationAsync(NotificationFeedbackType.Success);
        opacity3.value = withTiming(1, { duration });

        if (!advanced && currentCourse.currentCourse) {
            currentCourse.updateCurrentCourse({
                ...currentCourse.currentCourse,
                xp: currentCourse.currentCourse.xp + parseInt(xp),
            });
        }

        if (advanced || streak) {
            await sleep(1500);
            opacity1.value = withTiming(0, { duration });
            opacity2.value = withTiming(0, { duration });
            opacity3.value = withTiming(0, { duration });
            await sleep(duration);
        } else {
            await sleep(500);
            opacity4.value = withTiming(1, { duration });
        }
    }, []);

    useEffect(() => {
        Promise.all([playAnim(), loadNewSection()]).then(() => {
            if (advanced) {
                router.replace(
                    `/lessons/new-section?updatedStreak=${updatedStreak}`
                );
            } else if (streak) {
                router.replace("/lessons/streak");
            }
        });
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
                <Animated.View
                    style={{
                        opacity: animOpacity,
                    }}>
                    <LottieView
                        autoPlay
                        style={styles.animation}
                        source={clappingAnimation}
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        {
                            opacity: opacity1,
                            transform: [
                                {
                                    scale: scale1,
                                },
                            ],
                        },
                        styles.item,
                    ]}>
                    <ThemedText type="heading" style={styles.text}>
                        {t("lesson.success.title")}
                    </ThemedText>
                </Animated.View>
                <Animated.View style={[{ opacity: opacity2 }, styles.item]}>
                    <ThemedText type="secondary" style={styles.text}>
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
                    onPress={async () => {
                        if (advanced) {
                            return;
                        }

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
    text: {
        textAlign: "center",
    },
    button: {
        marginTop: 24,
        marginBottom: 8,
    },
    xp: {
        fontSize: 48,
        marginTop: 12,
        textAlign: "center",
    },
    animation: {
        width: 200,
        height: 100,
        alignSelf: "center",
        marginBottom: 16,
    },
});
