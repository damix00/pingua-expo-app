import { useBoxShadow } from "@/hooks/useBoxShadow";
import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, View, ViewProps } from "react-native";
import React from "react";

type ChipProps = ViewProps & {
    variant?: "primary" | "default" | "transparent";
    rounding?: "rounded" | "pill";
};

export default function Chip({
    children,
    style,
    variant = "primary",
    rounding = "rounded",
    ...props
}: ChipProps) {
    const colors = useThemeColors();
    const { boxShadow } = useBoxShadow("medium");

    return (
        <View
            {...props}
            style={[
                styles.container,
                {
                    backgroundColor: colors.primaryContainer,
                    boxShadow: variant == "primary" ? boxShadow : undefined,
                },
                variant == "default" && {
                    backgroundColor: colors.backgroundVariant,
                },
                variant == "transparent" && {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: colors.outlineVariant,
                },
                rounding == "pill" && {
                    borderRadius: 24,
                },
                style,
            ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        height: 24,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
        justifyContent: "space-evenly",
        gap: 4,
        alignItems: "center",
        flexDirection: "row",
    },
    selectable: {
        borderWidth: 1,
        borderColor: "gray",
    },
});
