import { useColorScheme } from "react-native";

export function useBoxShadow(type: "small" | "medium" | "large" = "small") {
    const scheme = useColorScheme();

    const large = {
        light: "0px 5px 6.68px rgba(0, 0, 0, 0.36)",
        dark: "0px 5px 7px rgba(0, 0, 0, 0.08)",
    };

    const medium = {
        light: "0px 2px 2px rgba(0, 0, 0, 0.1)",
        dark: "0px 2px 2px rgba(0, 0, 0, 0.05)",
    };

    const small = {
        light: "0px 1px 1px rgba(0, 0, 0, 0.1)",
        dark: "0px 1px 1px rgba(0, 0, 0, 0.05)",
    };

    return {
        boxShadow:
            type === "small"
                ? // @ts-ignore
                  small[scheme]
                : type === "medium"
                ? // @ts-ignore
                  medium[scheme]
                : // @ts-ignore
                  large[scheme],
    };
}
