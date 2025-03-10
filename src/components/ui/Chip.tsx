import { useBoxShadow } from "@/hooks/useBoxShadow";
import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, View, ViewProps } from "react-native";

export default function Chip({ children, style, ...props }: ViewProps) {
    const colors = useThemeColors();
    const { boxShadow } = useBoxShadow("medium");

    return (
        <View
            {...props}
            style={[
                styles.container,
                {
                    backgroundColor: colors.primaryContainer,
                    boxShadow,
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
});
