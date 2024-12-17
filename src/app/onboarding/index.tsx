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
import Dropdown from "@/components/input/stateful/Dropdown";

export default function FirstPage() {
    const colors = useThemeColors();
    const { t } = useTranslation();

    return (
        <OnboardingLayout scrollable={false}>
            <View style={[styles.container]}>
                {/* <Logo width={250} height={60} style={styles.logo} /> */}
                <Dropdown
                    values={["English", "Croatian"]}
                    selectedValue="English"
                    onSelect={() => {}}
                    textColor="white"
                    style={{ alignSelf: "flex-end" }}
                    position={{
                        right: 0,
                    }}
                />
                <View>
                    <BrandText onPrimary large style={[{ paddingBottom: 2 }]}>
                        {t("onboarding.page_1_title")}
                    </BrandText>
                    <ThemedText
                        style={{ color: colors.textSecondaryOnPrimary }}>
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
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    logo: {
        alignSelf: "center",
        opacity: 0.9,
    },
    buttonsWrapper: {
        paddingTop: 36,
        gap: 16,
        paddingBottom: 24,
    },
});
