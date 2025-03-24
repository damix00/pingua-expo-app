import { usePreferences } from "@/context/PreferencesContext";
import * as Haptics from "expo-haptics";
import NativeTouchable from "./NativeTouchable";
import { TouchableNativeFeedbackProps } from "react-native-gesture-handler/lib/typescript/components/touchables/TouchableNativeFeedbackProps";

export default function HapticNativeTouchable({
    enableHaptics = true,
    ...props
}: TouchableNativeFeedbackProps & {
    enableHaptics?: boolean;
    androidBorderRadius?: number;
}) {
    const preferences = usePreferences();

    return (
        <NativeTouchable
            {...props}
            // @ts-ignore
            onPressIn={(e) => {
                if (preferences?.preferences.hapticFeedback && enableHaptics) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                props.onPressIn && props.onPressIn(e);
            }}
        />
    );
}
