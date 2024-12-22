import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, TextInputProps, View } from "react-native";
import { TextInput as RNTextInput } from "react-native";
import { ThemedText } from "../ui/ThemedText";

export default function TextInput({
    style,
    title,
    ...props
}: TextInputProps & { title?: string }) {
    const colors = useThemeColors();

    return (
        <View style={styles.container}>
            {title && <ThemedText>{title}</ThemedText>}
            <RNTextInput
                style={[
                    styles.input,
                    {
                        color: colors.text,
                        borderColor: colors.outline,
                        backgroundColor: colors.background,
                    },
                    style,
                ]}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        // fontSize: 12,
        fontFamily: "Montserrat_400Regular",
        paddingHorizontal: 16,
        paddingVertical: 0,
        height: 36,
    },
});
