import { useColorScheme } from "react-native";

export function useBoxShadow() {
    const scheme = useColorScheme();

    if (scheme == "dark") return {};

    return {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
    };
}
