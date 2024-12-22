import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import BrandText from "@/components/ui/BrandText";
import StaticBackground from "@/components/ui/StaticBackground";
import { useAuth } from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import Logo from "@/assets/images/logo.svg";
import { Link } from "expo-router";
import OnboardingLayout from "./OnboardingLayout";
import AppLinkText from "@/components/input/AppLinkText";
import { useTranslation } from "react-i18next";

export default function FirstPage() {
    const colors = useThemeColors();
    const { t } = useTranslation();

    return (
        <OnboardingLayout scrollable={false}>
            <View style={[styles.container]}>
                <View style={styles.headingContainer}>
                    <BrandText onPrimary style={styles.logo}>
                        pingua
                    </BrandText>
                </View>
                <ThemedText>(slika pingvina)</ThemedText>
                <View>
                    <BrandText onPrimary large>
                        {t("onboarding.page_1_title")}
                    </BrandText>
                    <ThemedText
                        style={{
                            color: colors.textSecondaryOnPrimary,
                            marginTop: 4,
                        }}>
                        {t("onboarding.page_1_description")}
                    </ThemedText>
                    <View style={styles.buttonsWrapper}>
                        <Button
                            href="/onboarding/choose-languages"
                            variant="primaryVariant">
                            <ButtonText>{t("get_started")}</ButtonText>
                        </Button>
                        <AppLinkText
                            href="/auth"
                            style={{
                                textAlign: "center",
                                color: colors.textOnPrimary,
                            }}>
                            {t("onboarding.have_account")}
                        </AppLinkText>
                    </View>
                </View>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    headingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        fontSize: 32,
        paddingBottom: 8,
        lineHeight: 32,
        paddingTop: 8,
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    buttonsWrapper: {
        paddingTop: 36,
        gap: 8,
        paddingBottom: 24,
    },
});
