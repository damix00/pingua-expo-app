import { ThemedView } from "@/components/ThemedView";
import StaticBackground from "@/components/ui/StaticBackground";
import { ThemedText } from "@/components/ui/ThemedText";
import { useCurrentCourse } from "@/hooks/course";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useTimeout } from "@/hooks/useTimeout";
import { mascot } from "@/utils/cache/CachedImages";
import axios from "axios";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LessonLoading() {
    const insets = useSafeAreaInsets();
    const course = useCurrentCourse();
    const { t } = useTranslation();

    useTimeout(async () => {
        const response = await axios.post(
            `/v1/courses/${course.currentCourse.id}/lessons`
        );

        if (response.data.type == "story") {
            router.replace(
                `/lessons/story?data=${encodeURIComponent(
                    JSON.stringify(response.data.data)
                )}`
            );
        } else if (response.data.type == "questions") {
            router.replace(
                `/lessons/questions?data=${encodeURIComponent(
                    JSON.stringify(response.data.data)
                )}`
            );
        }
    }, 250);

    return (
        <StaticBackground
            style={[
                styles.background,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                },
            ]}
            showAura={false}>
            <Image style={styles.image} source={mascot} />
            <View style={styles.textWrapper}>
                <ThemedText onPrimary type="heading" style={styles.text}>
                    {t("lesson.loading")}
                </ThemedText>
                <ThemedText
                    type="onPrimarySecondary"
                    style={styles.text}
                    onPrimary>
                    {t("lesson.loading_description")}
                </ThemedText>
            </View>
        </StaticBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        gap: 24,
    },
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        margin: 24,
    },
    image: {
        height: 200,
        objectFit: "contain",
    },
    textWrapper: {
        width: "100%",
        alignItems: "flex-start",
        gap: 4,
    },
    text: {
        textAlign: "center",
        width: "100%",
    },
});
