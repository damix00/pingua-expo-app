import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { SafeAreaView } from "react-native-safe-area-context";

export const ONBOARDING_APPBAR_HEIGHT = 56;

export default function OnboardingAppbar() {
    return (
        <SafeAreaView
            style={{
                backgroundColor: "transparent",
            }}>
            <View style={styles.container}>
                {/* This resizes the touchable width to only fit the icon */}
                <View style={{ flexDirection: "row" }}>
                    <HapticTouchableOpacity
                        onPress={() => {
                            router.back();
                        }}>
                        <ChevronLeft
                            color="white"
                            style={{
                                margin: 16,
                            }}
                        />
                    </HapticTouchableOpacity>
                </View>
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
