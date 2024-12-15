import { Text, type TextProps, StyleSheet, Platform } from "react-native";

import { useThemeColor, useThemeColors } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?:
        | "default"
        | "title"
        | "defaultSemiBold"
        | "subtitle"
        | "link"
        | "onPrimary"
        | "onPrimarySecondary";
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = "default",
    ...rest
}: ThemedTextProps) {
    const color = useThemeColor("text");
    const colors = useThemeColors();

    return (
        <Text
            style={[
                { color },
                type === "default" ? styles.default : undefined,
                type === "title" ? styles.title : undefined,
                type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
                type === "subtitle" ? styles.subtitle : undefined,
                type === "link" ? styles.link : undefined,
                type === "onPrimary"
                    ? {
                          ...styles.default,
                          color: colors.textOnPrimary,
                      }
                    : undefined,
                type === "onPrimarySecondary"
                    ? {
                          ...styles.default,
                          color: colors.textSecondaryOnPrimary,
                      }
                    : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "600",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: "#0a7ea4",
    },
});
