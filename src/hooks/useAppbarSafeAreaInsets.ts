import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function useAppbarSafeAreaInsets() {
    const insets = useSafeAreaInsets();

    return {
        ...insets,
        top: insets.top + (Platform.OS === "ios" ? 48 : 72),
    };
}
