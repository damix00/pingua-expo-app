import BrandText from "@/components/ui/BrandText";
import OnboardingLayout from "./OnboardingLayout";
import { View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import GlassCard, { GlassCardSelection } from "@/components/ui/GlassCard";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { useState } from "react";

const fluencyLevels = [
    {
        title: "Beginner",
        description: "I know a few words and phrases.",
    },
    {
        title: "Intermediate",
        description: "I can hold a basic conversation.",
    },
    {
        title: "Advanced",
        description: "I can discuss most topics fluently.",
    },
    {
        title: "Fluent",
        description: "I can communicate like a native speaker.",
    },
];

export default function ChooseFluencyOnboarding() {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const { language } = useLocalSearchParams();

    return (
        <OnboardingLayout appbar>
            <View style={styles.parent}>
                <BrandText
                    onPrimary
                    large
                    style={[{ paddingBottom: 4, fontSize: 28 }]}>
                    How fluent are you in {language}?
                </BrandText>
                <View style={styles.listContainer}>
                    {fluencyLevels.map((level) => (
                        <GlassCardSelection
                            contentPadding={0}
                            selected={selectedLevel == level.title}
                            onSelect={() => {
                                setSelectedLevel(
                                    selectedLevel == level.title
                                        ? null
                                        : level.title
                                );
                            }}
                            style={styles.card}
                            key={level.title}>
                            <ThemedText
                                style={{ marginBottom: 2, fontSize: 16 }}
                                type="onPrimary">
                                {level.title}
                            </ThemedText>
                            <ThemedText
                                type="onPrimarySecondary"
                                style={{ fontSize: 12 }}>
                                {level.description}
                            </ThemedText>
                        </GlassCardSelection>
                    ))}
                </View>
                <Button
                    disabled={!selectedLevel}
                    variant="primaryVariant"
                    style={{ marginTop: 36, marginBottom: 12 }}
                    onPress={() => {}}>
                    <ButtonText>Continue</ButtonText>
                </Button>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        justifyContent: "space-between",
    },
    listContainer: {
        gap: 8,
        marginTop: 24,
        flex: 1,
    },
    card: {
        paddingHorizontal: 16,
    },
});
