// useHaptics is a wrapper around the Haptics module from Expo that allows us to easily enable or disable haptic feedback in our app.
// This is useful for users who may not want haptic feedback, or for testing purposes.

import { usePreferences } from "@/context/PreferencesContext";
import * as Haptics from "expo-haptics";
import { Vibration } from "react-native";

export default function useHaptics() {
    const prefs = usePreferences();

    if (!prefs?.preferences.hapticFeedback) {
        return {
            notificationAsync: async () => {},
            impactAsync: async () => {},
            selectionAsync: async () => {},
            vibrate: (...args: any[]) => {},
            successVibration: () => {},
        };
    }

    return {
        notificationAsync: Haptics.notificationAsync,
        impactAsync: Haptics.impactAsync,
        selectionAsync: Haptics.selectionAsync,
        vibrate: Vibration.vibrate,
        successVibration: () => {
            for (let i = 0; i < 225; i++) {
                setTimeout(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                }, i * 5);
            }
        },
    };
}
