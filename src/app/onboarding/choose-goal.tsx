import BrandText from "@/components/ui/BrandText";
import OnboardingLayout from "./OnboardingLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import GlassCard from "@/components/ui/GlassCard";
import { router, useLocalSearchParams } from "expo-router";
import { objectToQueryString } from "@/utils/util";

export default function ChooseGoalOnboarding() {
    const { t } = useTranslation();
    const { code, fluency, ...params } = useLocalSearchParams();

    return (
        <OnboardingLayout appbar>
            <View style={styles.parent}>
                <ThemedText
                    type="heading"
                    onPrimary
                    style={[{ paddingBottom: 4 }]}>
                    {t("onboarding.page_4_title")}
                </ThemedText>
                <ThemedText type="onPrimarySecondary">
                    {t("onboarding.page_4_description")}
                </ThemedText>
                <View style={styles.listContainer}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <GlassCard
                            onPress={() => {
                                if (params.email && params.otp) {
                                    router.push(
                                        `/auth/profile-setup?code=${code}&fluency=${index}&goal=${index}&${objectToQueryString(
                                            params
                                        )}`
                                    );
                                } else {
                                    router.push(
                                        `/auth?code=${code}&fluency=${fluency}&goal=${index}&${objectToQueryString(
                                            params
                                        )}`
                                    );
                                }
                            }}
                            style={{
                                paddingHorizontal: 16,
                            }}
                            contentPadding={0}
                            key={index}>
                            <ThemedText
                                style={{ marginBottom: 2, fontSize: 16 }}
                                type="onPrimary">
                                {t(`onboarding.goals.tier_${index + 1}`)}
                            </ThemedText>
                            <ThemedText
                                type="onPrimarySecondary"
                                style={{ fontSize: 12 }}>
                                {t(
                                    `onboarding.goals.tier_${
                                        index + 1
                                    }_description`
                                )}
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
        justifyContent: "flex-start",
    },
    listContainer: {
        gap: 8,
        marginTop: 24,
        flex: 1,
    },
});
