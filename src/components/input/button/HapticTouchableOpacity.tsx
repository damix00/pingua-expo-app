import { usePreferences } from "@/context/PreferencesContext";
import * as Haptics from "expo-haptics";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export default function HapticTouchableOpacity({
    ...props
}: TouchableOpacityProps) {
    const preferences = usePreferences();

    return (
        <TouchableOpacity
            {...props}
            onPressIn={(e) => {
                if (preferences?.preferences.hapticFeedback) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                props.onPressIn && props.onPressIn(e);
            }}
        />
    );
}
