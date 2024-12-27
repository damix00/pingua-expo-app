import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";

export default function ProfileTab() {
    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <ThemedText>Profile</ThemedText>
        </ThemedView>
    );
}
