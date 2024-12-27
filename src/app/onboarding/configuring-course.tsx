import StaticBackground from "@/components/ui/StaticBackground";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTimeout } from "@/hooks/useTimeout";
import { mascot } from "@/utils/cache/CachedImages";
import { objectToQueryString } from "@/utils/util";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";

export default function OnboardingConfiguringCourse() {
    const { code, fluency, ...params } = useLocalSearchParams();
    const { t } = useTranslation();

    useTimeout(() => {
        router.replace(
            `/onboarding/choose-goal?code=${code}&fluency=${fluency}&${objectToQueryString(
                params
            )}`
        );
    }, 3000 + Math.random() * 2000);

    return (
        <StaticBackground showAura={false}>
            <View style={styles.page}>
                <Image style={styles.image} source={mascot} />
                <View style={styles.textWrapper}>
                    <ThemedText onPrimary type="heading">
                        {t("onboarding.configuring_course_title")}
                    </ThemedText>
                    <ThemedText type="onPrimarySecondary" onPrimary>
                        {t("onboarding.configuring_course_description")}
                    </ThemedText>
                </View>
            </View>
        </StaticBackground>
    );
}

const styles = StyleSheet.create({
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
});
