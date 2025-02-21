import AudioButton from "@/components/input/button/AudioButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { StyleSheet, View } from "react-native";

export function TaskTitle({
    title,
    question,
    audio,
    onAudioEnd,
}: {
    title: string;
    question: string;
    audio?: string;
    onAudioEnd?: () => void;
}) {
    return (
        <View style={styles.textWrapper}>
            <ThemedText type="secondary" style={{ textAlign: "center" }}>
                {title}
            </ThemedText>
            <View style={styles.questionWrapper}>
                {audio && (
                    <AudioButton audioUri={audio} onAudioEnd={onAudioEnd} />
                )}
                <ThemedText style={styles.taskText} fontWeight="800">
                    {question}
                </ThemedText>
            </View>
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
    },
    questionWrapper: {
        marginTop: 8,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
    },
});
