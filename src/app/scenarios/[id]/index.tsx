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
import {
    Gesture,
    GestureDetector,
    ScrollView,
} from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useCallback, useEffect } from "react";
import { mascot } from "@/utils/cache/CachedImages";
import GestureDismissableModal from "@/components/modal/GestureDismissableModal";
import { useScenario } from "@/context/ScenariosContext";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";

export default function ScenarioScreen() {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const scenario = useScenario(id);

    console.log(scenario);

    const colors = useThemeColors();
    const { t } = useTranslation();

    if (!scenario) {
        return (
            <ThemedView
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ThemedText>{t("errors.something_went_wrong")}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <GestureDismissableModal
            style={{
                alignItems: "center",
                justifyContent: "center",
            }}
            onDismiss={() => router.back()}>
            <ScrollView bounces={false}>
                <ThemedText>{scenario.title}</ThemedText>
            </ScrollView>
        </GestureDismissableModal>
    );
}
