import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

export default function LessonSuccessPage() {
    const { xp } = useLocalSearchParams<{
        xp: string;
    }>();

    return (
        <ThemedView style={styles.container}>
            <ThemedText>+{xp} XP</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
