import { useThemeColors } from "@/hooks/useThemeColor";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

export const ONBOARDING_APPBAR_HEIGHT = 56;

export default function OnboardingAppbar({ title }: { title: string }) {
    return (
        <SafeAreaView
            style={{
                backgroundColor: "transparent",
            }}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={{ backgroundColor: "red" }}
                    onPress={() => {
                        router.back();
                    }}>
                    <ChevronLeft
                        color="white"
                        style={{
                            margin: 16,
                        }}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: ONBOARDING_APPBAR_HEIGHT,
        justifyContent: "center",
    },
});
