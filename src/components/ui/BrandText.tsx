import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, Text, TextProps } from "react-native";

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
                large && { fontSize: 36, lineHeight: 36 * 1.2 }, // 1.2 is the recommended line height for headings
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
