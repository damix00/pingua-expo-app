import { Text, type TextProps, StyleSheet, Platform } from "react-native";

import { useThemeColor, useThemeColors } from "@/hooks/useThemeColor";
import Autolink, { AutolinkProps } from "react-native-autolink";

export type ThemedTextProps = TextProps & {
    onPrimary?: boolean;
    type?:
        | "primary"
        | "default"
        | "secondary"
        | "title"
        | "defaultSemiBold"
        | "subtitle"
        | "link"
        | "onPrimary"
        | "onPrimarySecondary"
        | "heading";
};

export function ThemedText({
    style,
    onPrimary = false,
    type = "default",
    ...rest
}: ThemedTextProps) {
    const color = useThemeColor("text");
    const colors = useThemeColors();

    return (
        <Text
            style={[
                { color: onPrimary ? colors.textOnPrimary : color },
                type === "default" ? styles.default : undefined,
                type === "primary"
                    ? { color: colors.primary, ...styles.primary }
                    : undefined,
                type == "secondary"
                    ? { ...styles.default, color: colors.textSecondary }
                    : undefined,
                type === "title" ? styles.title : undefined,
                type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
                type === "subtitle" ? styles.subtitle : undefined,
                type === "link" ? styles.link : undefined,
                type === "heading" ? styles.heading : undefined,
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
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
    },
    title: {
        fontSize: 32,
        fontFamily: "Montserrat_900Black",
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontFamily: "Montserrat_700Bold",
    },
    heading: {
        fontSize: 28,
        fontFamily: "Montserrat_900Black",
    },
    primary: {
        fontFamily: "Montserrat_600SemiBold",
    },
    link: {
        fontSize: 16,
        color: "#0a7ea4",
    },
});
