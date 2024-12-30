import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, View, ViewProps } from "react-native";

export default function Chip({ children, style, ...props }: ViewProps) {
    const colors = useThemeColors();

    return (
        <View
            {...props}
            style={[
                styles.container,
                {
                    backgroundColor: colors.primaryContainer,
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
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
});
