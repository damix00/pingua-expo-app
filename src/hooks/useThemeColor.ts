/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from "react-native";

import { Colors } from "@/constants/Colors";

export function useThemeColor(
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme() ?? "light";
    return Colors[theme][colorName];
}

export function useThemeColors() {
    const theme = useColorScheme() ?? "light";

    return Colors[theme];
}
