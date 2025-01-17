import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function TranslatedText({
    text,
    translation,
}: {
    text: string;
    translation: string;
}) {
    const [showTranslation, setShowTranslation] = useState(false);
    const colors = useThemeColors();

    return (
        <View>
            <ThemedText>{text}</ThemedText>
        </View>
    );
}
