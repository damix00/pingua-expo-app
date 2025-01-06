import { StyleSheet, Text, TextProps } from "react-native";
import { useButtonContext } from "./Button";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function ButtonText({ children, style, ...props }: TextProps) {
    const context = useButtonContext();
    const colors = useThemeColors();

    return (
        <Text
            style={[
                styles.text,
                {
                    color:
                        context.variant == "secondary" ||
                        context.variant == "text"
                            ? colors.text
                            : colors.textOnPrimary,
                },
                style,
            ]}
            {...props}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 13,
        fontFamily: "Montserrat_600SemiBold",
    },
});
