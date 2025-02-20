import { ThemedText } from "@/components/ui/ThemedText";
import { StyleSheet, View } from "react-native";

export function TaskTitle({
    title,
    question,
}: {
    title: string;
    question: string;
}) {
    return (
        <View style={styles.textWrapper}>
            <ThemedText type="secondary" style={{ textAlign: "center" }}>
                {title}
            </ThemedText>
            <ThemedText style={styles.taskText} fontWeight="800">
                {question}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    textWrapper: {
        gap: 4,
        marginBottom: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    taskText: {
        fontSize: 24,
        textAlign: "center",
        marginTop: 8,
    },
});
