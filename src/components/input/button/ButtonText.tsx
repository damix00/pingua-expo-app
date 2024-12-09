import { Text, TextProps } from "react-native";
import { useButtonContext } from "./Button";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function ButtonText({ children, style, ...props }: TextProps) {
    const context = useButtonContext();
    const colors = useThemeColors();

    return (
        <Text
            style={[
                {
                    color:
                        context.variant == "secondary"
                            ? colors.text
                            : colors.textOnPrimary,
                    fontFamily:
                        context.variant == "secondary"
                            ? "WorkSans_600SemiBold"
                            : "WorkSans_700Bold",
                },
                style,
            ]}
            {...props}>
            {children}
        </Text>
    );
}
