import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ONBOARDING_APPBAR_HEIGHT = 56;

export default function OnboardingAppbar({
    darkText = false,
}: {
    darkText?: boolean;
}) {
    const safeAreaInsets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    marginTop: safeAreaInsets.top,
                },
            ]}>
            <TouchableOpacity
                onPress={() => {
                    router.back();
                }}>
                <ChevronLeft color={darkText ? "black" : "white"} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: ONBOARDING_APPBAR_HEIGHT,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        width: "100%",
    },
});
