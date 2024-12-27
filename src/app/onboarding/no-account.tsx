import AppLinkText from "@/components/input/AppLinkText";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import StaticBackground from "@/components/ui/StaticBackground";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTimeout } from "@/hooks/useTimeout";
import { mascot } from "@/utils/cache/CachedImages";
import { objectToQueryString } from "@/utils/util";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingConfiguringCourse() {
    const params = useLocalSearchParams();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <StaticBackground showAura={false}>
            <ScrollView
                alwaysBounceVertical={false}
                contentContainerStyle={styles.page}
                style={[
                    {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    },
                ]}>
                <View style={styles.imageParent}>
                    <Image style={styles.image} source={mascot} />
                </View>
                <View style={styles.buttonWrapper}>
                    <View style={styles.textWrapper}>
                        <ThemedText onPrimary type="heading">
                            {t("onboarding.no_account_title")}
                        </ThemedText>
                        <ThemedText type="onPrimarySecondary" onPrimary>
                            {t("onboarding.no_account_description")}
                        </ThemedText>
                    </View>
                    <Button
                        href={`/onboarding/choose-languages?${objectToQueryString(
                            params
                        )}`}
                        variant="primaryVariant">
                        <ButtonText>{t("continue")}</ButtonText>
                    </Button>
                    <Button
                        variant="text"
                        onPress={() => {
                            router.back();
                        }}>
                        <ButtonText>{t("back")}</ButtonText>
                    </Button>
                </View>
            </ScrollView>
        </StaticBackground>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        paddingHorizontal: 24,
    },
    image: {
        height: 256,
        width: 256,
        objectFit: "contain",
    },
    imageParent: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    textWrapper: {
        width: "100%",
        alignItems: "flex-start",
        gap: 4,
        marginBottom: 16,
    },
    buttonWrapper: {
        width: "100%",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
});
