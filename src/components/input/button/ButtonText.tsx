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
                        context.variant == "secondary"
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
        fontSize: 14,
        fontFamily: "Montserrat_600SemiBold",
    },
});
