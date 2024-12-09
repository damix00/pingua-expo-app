import { useThemeColor } from "@/hooks/useThemeColor";
import { getLoadedFonts } from "expo-font";
import { StyleSheet, Text, TextProps } from "react-native";
import { NativeProps } from "react-native-safe-area-context/lib/typescript/src/specs/NativeSafeAreaView";

export default function BrandText({
    children,
    style,
    ...props
}: { children?: React.ReactNode } & TextProps) {
    const color = useThemeColor("text");

    return (
        <Text style={[styles.text, { color }, style]} {...props}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "WorkSans_900Black",
    },
});
