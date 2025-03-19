import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

export default function useAppbarSafeAreaInsets() {
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();

    return {
        ...insets,
        top: headerHeight,
    };
}

export function useBottomNavSafeAreaInsets() {
    const insets = useSafeAreaInsets();
    const tabBarHeight = useBottomTabBarHeight();
    const headerHeight = useHeaderHeight();

    return {
        ...insets,
        bottom: tabBarHeight,
        top: headerHeight,
    };
}
