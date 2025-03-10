import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColor";

export const ONBOARDING_APPBAR_HEIGHT = 56;

export default function OnboardingAppbar({
    adaptiveColor = false,
}: {
    adaptiveColor?: boolean;
}) {
    const safeAreaInsets = useSafeAreaInsets();
    const colors = useThemeColors();

    return (
        <View
            style={[
                styles.container,
                {
                    marginTop: safeAreaInsets.top,
                },
            ]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    router.back();
                }}>
                <ChevronLeft color={adaptiveColor ? colors.text : "white"} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: ONBOARDING_APPBAR_HEIGHT,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        height: "100%",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
});
