import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useCurrentCourse } from "@/hooks/course";
import useHaptics from "@/hooks/useHaptics";
import { saveUserCache } from "@/utils/cache/user-cache";
import { sleep } from "@/utils/util";
import axios from "axios";
import { NotificationFeedbackType } from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LessonSuccessPage() {
    const { xp, advancedToNextSection } = useLocalSearchParams<{
        xp: string;
        advancedToNextSection: string;
    }>();

    const insets = useSafeAreaInsets();
    const haptics = useHaptics();
    const currentCourse = useCurrentCourse();

    const auth = useAuth();

    const { t } = useTranslation();

    const opacity1 = useSharedValue(0);
    const opacity2 = useSharedValue(0);
    const opacity3 = useSharedValue(0);
    const opacity4 = useSharedValue(0);

    const duration = 500;

    const loadNewSection = useCallback(async () => {
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
        opacity1.value = withTiming(1, { duration });
        await sleep(1000);
        opacity2.value = withTiming(1, { duration });

        await sleep(1000);
        haptics.notificationAsync(NotificationFeedbackType.Success);
        opacity3.value = withTiming(1, { duration });

        if (advancedToNextSection) {
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
            if (advancedToNextSection) {
                router.replace("/lessons/new-section");
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
                <Animated.View style={[{ opacity: opacity1 }, styles.item]}>
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
                    onPress={() => {
                        if (advancedToNextSection) {
                            return;
                        }

                        if (!currentCourse.currentCourse) {
                            return;
                        }

                        currentCourse.updateCurrentCourse({
                            ...currentCourse.currentCourse,
                            xp: currentCourse.currentCourse.xp + parseInt(xp),
                        });

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
});
