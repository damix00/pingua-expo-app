import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedText } from "@/components/ui/ThemedText";
import { Link, router, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import OnboardingLayout from "./OnboardingLayout";
import BrandText from "@/components/ui/BrandText";
import GlassCard, { GlassCardSelection } from "@/components/ui/GlassCard";
import twemoji from "@twemoji/api";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { SvgUri } from "react-native-svg";
import { Fragment, useState } from "react";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CachedSvgUri } from "@/utils/cache/SVGCache";
import { ONBOARDING_APPBAR_HEIGHT } from "./OnboardingAppbar";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react-native";
import {
    CourseLanguage,
    courseLanguages,
    findFlag,
    languageMap,
} from "@/utils/i18n";
import { objectToQueryString } from "@/utils/util";

function ChooseLanguageCard({
    code,
    flag,
    onPress,
}: CourseLanguage & { onPress: () => void }) {
    const { t } = useTranslation();

    return (
        <GlassCard
            onPress={onPress}
            style={{ paddingVertical: 0 }}
            elevation="1"
            leading={<CachedSvgUri width={50} height={50} uri={flag} />}>
            <ThemedText type="onPrimary">{t(`languages.${code}`)}</ThemedText>
        </GlassCard>
    );
}

export default function ChooseLanguageOnboarding() {
    const insets = useSafeAreaInsets();
    const { t, i18n } = useTranslation();
    const params = useLocalSearchParams();

    const languages = courseLanguages.filter(
        (language) => language.code !== i18n.language
    );

    return (
        <OnboardingLayout appbar scrollable={false} safeArea={false}>
            <FlatList
                indicatorStyle="white"
                style={{
                    flex: 1,
                    flexGrow: 1,
                }}
                ListFooterComponentStyle={{
                    flex: 1,
                    justifyContent: "flex-end",
                }}
                data={languages}
                ListHeaderComponent={
                    <View
                        style={{
                            marginTop: ONBOARDING_APPBAR_HEIGHT + insets.top,
                        }}>
                        <ThemedText
                            onPrimary
                            type="heading"
                            style={[{ paddingBottom: 16 }]}>
                            {t("onboarding.page_2_title")}
                        </ThemedText>
                        <ThemedText
                            type="onPrimarySecondary"
                            style={{ marginBottom: 8 }}>
                            {t("onboarding.i_speak")}
                        </ThemedText>
                        <GlassCard
                            leading={
                                <CachedSvgUri
                                    width={50}
                                    height={50}
                                    uri={findFlag(i18n.language) ?? ""}
                                />
                            }
                            trailing={<ChevronRight color="white" size={24} />}
                            style={{ paddingVertical: 0 }}
                            elevation="1"
                            onPress={() => {
                                router.push("/onboarding/app-language");
                            }}>
                            <ThemedText type="onPrimary">
                                {t(`languages.${i18n.language}`)}
                            </ThemedText>
                        </GlassCard>
                        <ThemedText
                            type="onPrimarySecondary"
                            style={{
                                marginTop: 16,
                            }}>
                            {t("onboarding.i_want_to_learn")}
                        </ThemedText>
                    </View>
                }
                renderItem={({ item }) => (
                    <ChooseLanguageCard
                        onPress={() => {
                            router.push(
                                `/onboarding/choose-fluency?code=${
                                    item.code
                                }&${objectToQueryString(params)}`
                            );
                        }}
                        {...item}
                    />
                )}
                keyExtractor={(item) => item.code}
                contentContainerStyle={{
                    paddingBottom: 12 + insets.bottom,
                    gap: 8,
                    flexGrow: 1,
                    paddingHorizontal: 24,
                }}
            />
        </OnboardingLayout>
    );
}
