import { useThemeColor, useThemeColors } from "@/hooks/useThemeColor";
import { getLoadedFonts } from "expo-font";
import { StyleSheet, Text, TextProps } from "react-native";
import { NativeProps } from "react-native-safe-area-context/lib/typescript/src/specs/NativeSafeAreaView";

export default function BrandText({
    children,
    style,
    onPrimary = false,
    large = false,
    ...props
}: {
    onPrimary?: boolean;
    large?: boolean;
    children?: React.ReactNode;
} & TextProps) {
    const colors = useThemeColors();

    return (
        <Text
            style={[
                styles.text,
                { color: onPrimary ? colors.textOnPrimary : colors.text },
                large && { fontSize: 36 },
                style,
            ]}
            {...props}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Comfortaa_700Bold",
    },
});
