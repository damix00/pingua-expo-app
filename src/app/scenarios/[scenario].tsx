import { ThemedText } from "@/components/ui/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    clamp,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useCallback, useEffect } from "react";
import { mascot } from "@/utils/cache/CachedImages";
import GestureDismissableModal from "@/components/modal/GestureDismissableModal";

export default function ScenarioScreen() {
    const { scenario } = useLocalSearchParams<{
        scenario: string;
    }>();

    const colors = useThemeColors();

    return (
        <GestureDismissableModal
            style={{
                alignItems: "center",
                justifyContent: "center",
            }}
            onDismiss={() => router.back()}>
            <ThemedText>Scenario: {scenario}</ThemedText>
        </GestureDismissableModal>
    );
}
