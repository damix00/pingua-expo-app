import BrandText from "@/components/ui/BrandText";
import OnboardingLayout from "./OnboardingLayout";
import { View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import GlassCard, { GlassCardSelection } from "@/components/ui/GlassCard";
import { useTranslation } from "react-i18next";

const fluencyLevels = [
    {
        title: "beginner",
        description: "beginner_description",
    },
    {
        title: "intermediate",
        description: "intermediate_description",
    },
    {
        title: "advanced",
        description: "advanced_description",
    },
    {
        title: "fluent",
        description: "fluent_description",
    },
];

export default function ChooseFluencyOnboarding() {
    const { code } = useLocalSearchParams();
    const { t } = useTranslation();

    const language = t(`languages.${code}`);

    return (
        <OnboardingLayout appbar>
            <View style={styles.parent}>
                <ThemedText
                    onPrimary
                    type="heading"
                    style={[{ paddingBottom: 4 }]}>
                    {t("onboarding.page_3_title", {
                        language,
                    })}
                </ThemedText>
                <View style={styles.listContainer}>
                    {fluencyLevels.map((level, index) => (
                        <GlassCard
                            onPress={() => {
                                router.push(
                                    `/onboarding/configuring-course?code=${code}&fluency=${index}`
                                );
                            }}
                            contentPadding={0}
                            style={styles.card}
                            key={level.title}>
                            <ThemedText
                                style={{ marginBottom: 2, fontSize: 16 }}
                                type="onPrimary">
                                {t(`onboarding.fluency.${level.title}`)}
                            </ThemedText>
                            <ThemedText
                                type="onPrimarySecondary"
                                style={{ fontSize: 12 }}>
                                {t(`onboarding.fluency.${level.description}`, {
                                    language,
                                })}
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
