import BrandText from "@/components/ui/BrandText";
import OnboardingLayout from "./OnboardingLayout";
import { View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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
                        <GlassCard
                            onPress={() => {
                                router.push(
                                    `/onboarding/choose-goal?language=${language}&fluency=${level.title}`
                                );
                            }}
                            contentPadding={0}
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
                        </GlassCard>
                    ))}
                </View>
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
