import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";

export default function TranslateTab() {
    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
                padding: 24,
            }}>
            <ThemedText>Translate</ThemedText>
        </ThemedView>
    );
}
