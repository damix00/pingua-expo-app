import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useTranslation } from "react-i18next";

export default function TranslateTab() {
    const { t } = useTranslation();

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
