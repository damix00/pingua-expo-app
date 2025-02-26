import { ThemedText } from "@/components/ui/ThemedText";
import { FlatList, View } from "react-native";
import OnboardingLayout from "./OnboardingLayout";
import GlassCard from "@/components/ui/GlassCard";
import { ONBOARDING_APPBAR_HEIGHT } from "./OnboardingAppbar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CachedSvgUri } from "@/utils/cache/SVGCache";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react-native";
import {
    appLanguages,
    findFlag,
    languageCodeMap,
    languageMap,
    saveLocale,
} from "@/utils/i18n";
import { router } from "expo-router";
import OnboardingStatic from "@/context/OnboardingStatic";
import * as Localization from "expo-localization";

function ChooseLanguageCard({
    language,
    onPress,
}: {
    language: string;
    onPress: () => void;
}) {
    const { t } = useTranslation();

    return (
        <GlassCard
            onPress={onPress}
            style={{ paddingVertical: 0 }}
            elevation="1"
            leading={
                <CachedSvgUri
                    width={50}
                    height={50}
                    uri={findFlag(language) ?? ""}
                />
            }>
            <ThemedText type="onPrimary">
                {languageMap[language as keyof typeof languageMap]}
            </ThemedText>
        </GlassCard>
    );
}

export default function AppLanguagePage() {
    const insets = useSafeAreaInsets();
    const { t, i18n } = useTranslation();

    const languages = Object.values(languageCodeMap);

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
                            {t("onboarding.i_speak")}
                        </ThemedText>
                    </View>
                }
                renderItem={({ item }) => (
                    <ChooseLanguageCard
                        language={item}
                        onPress={async () => {
                            if (appLanguages.includes(item)) {
                                i18n.changeLanguage(item);
                                await saveLocale(item);
                            } else {
                                i18n.changeLanguage(
                                    Localization.getLocales()[0].languageCode ??
                                        "en"
                                );
                                await saveLocale(null);
                            }

                            OnboardingStatic.appLanguage = item;

                            router.back();
                        }}
                    />
                )}
                keyExtractor={(item) => item}
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
