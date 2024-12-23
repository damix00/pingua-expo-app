import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BaseToastProps } from "react-native-toast-message";
import { ThemedText } from "../ThemedText";
import { CircleAlert } from "lucide-react-native";

export default function BaseToast({
    text1,
    text2,
    error,
    ...props
}: BaseToastProps & {
    error?: boolean;
}) {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    return (
        <View
            style={{
                paddingTop: insets.top + 16,
                paddingBottom: insets.bottom,
                paddingHorizontal: 24,
                width: "100%",
            }}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background,
                        borderColor: colors.outlineSecondary,
                    },
                ]}>
                {error && <CircleAlert size={24} color="red" />}
                <View style={styles.textContainer}>
                    <ThemedText>{text1}</ThemedText>
                    {text2 && (
                        <ThemedText style={{ fontSize: 12 }} type="secondary">
                            {text2}
                        </ThemedText>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    textContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
});
