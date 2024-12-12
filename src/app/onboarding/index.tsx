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

export default function FirstPage() {
    const colors = useThemeColors();

    return (
        <OnboardingLayout scrollable={false}>
            <View style={[styles.container]}>
                <Logo width={250} height={60} style={styles.logo} />
                <View>
                    <BrandText
                        style={[
                            { color: colors.textOnPrimary, paddingBottom: 2 },
                            styles.text,
                        ]}>
                        Speak with confidence.
                    </BrandText>
                    <ThemedText
                        style={{ color: colors.textSecondaryOnPrimary }}>
                        Your journey to fluency starts here.
                    </ThemedText>
                    <View
                        style={{ paddingTop: 36, gap: 16, paddingBottom: 24 }}>
                        <Button
                            href="/onboarding/choose-languages"
                            variant="primaryVariant">
                            <ButtonText>Get started</ButtonText>
                        </Button>
                        <AppLinkText
                            href="/auth"
                            style={{
                                textAlign: "center",
                                color: colors.textOnPrimary,
                            }}>
                            I already have an account
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
    text: {
        fontSize: 36,
    },
});
