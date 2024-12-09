import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import BrandText from "@/components/ui/BrandText";
import StaticBackground from "@/components/ui/StaticBackground";
import { useAuth } from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";

export default function AuthPage() {
    const colors = useThemeColors();

    return (
        <StaticBackground>
            <SafeAreaView
                style={{
                    margin: 24,
                    flex: 1,
                    justifyContent: "flex-end",
                }}>
                <BrandText
                    style={[
                        { color: colors.textOnPrimary, paddingBottom: 2 },
                        styles.text,
                    ]}>
                    Speak with confidence.
                </BrandText>
                <ThemedText style={{ color: colors.textSecondaryOnPrimary }}>
                    Your journey to fluency starts here.
                </ThemedText>
                <View style={{ paddingTop: 36, gap: 18, paddingBottom: 24 }}>
                    <Button onPress={() => {}}>
                        <ButtonText>Get started</ButtonText>
                    </Button>
                    <ThemedText
                        style={{
                            textAlign: "center",
                            color: colors.textOnPrimary,
                        }}>
                        I already have an account
                    </ThemedText>
                </View>
            </SafeAreaView>
        </StaticBackground>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 36,
    },
});
