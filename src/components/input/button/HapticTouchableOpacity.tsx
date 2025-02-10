import { usePreferences } from "@/context/PreferencesContext";
import * as Haptics from "expo-haptics";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Animated from "react-native-reanimated";

export default function HapticTouchableOpacity({
    enableHaptics = true,
    ...props
}: TouchableOpacityProps & {
    enableHaptics?: boolean;
}) {
    const preferences = usePreferences();

    return (
        <TouchableOpacity
            {...props}
            onPressIn={(e) => {
                if (preferences?.preferences.hapticFeedback && enableHaptics) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                props.onPressIn && props.onPressIn(e);
            }}
        />
    );
}
