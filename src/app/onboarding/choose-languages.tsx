import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedText } from "@/components/ui/ThemedText";
import { Link } from "expo-router";
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

type Language = {
    language: string;
    flag: string;
};

const languages: Language[] = [
    {
        language: "English",
        flag: `${twemoji.base}svg/1f1ec-1f1e7.svg`,
    },
    {
        language: "German",
        flag: `${twemoji.base}svg/1f1e9-1f1ea.svg`,
    },
    {
        language: "Croatian",
        flag: `${twemoji.base}svg/1f1ed-1f1f7.svg`,
    },
    {
        language: "Spanish",
        flag: `${twemoji.base}svg/1f1ea-1f1f8.svg`,
    },
    {
        language: "French",
        flag: `${twemoji.base}svg/1f1eb-1f1f7.svg`,
    },
    {
        language: "Italian",
        flag: `${twemoji.base}svg/1f1ee-1f1f9.svg`,
    },
    {
        language: "Russian",
        flag: `${twemoji.base}svg/1f1f7-1f1fa.svg`,
    },
    {
        language: "Portuguese",
        flag: `${twemoji.base}svg/1f1f5-1f1f9.svg`,
    },
    {
        language: "Turkish",
        flag: `${twemoji.base}svg/1f1f9-1f1f7.svg`,
    },
    {
        language: "Greek",
        flag: `${twemoji.base}svg/1f1ec-1f1f7.svg`,
    },
    {
        language: "Dutch",
        flag: `${twemoji.base}svg/1f1f3-1f1f1.svg`,
    },
    {
        language: "Polish",
        flag: `${twemoji.base}svg/1f1f5-1f1f1.svg`,
    },
    {
        language: "Swedish",
        flag: `${twemoji.base}svg/1f1f8-1f1ea.svg`,
    },
];

function ChooseLanguageCard({
    language,
    flag,
    onSelect,
    selected,
}: Language & {
    onSelect: () => void;
    selected: boolean;
}) {
    return (
        <GlassCardSelection
            selected={selected}
            onSelect={onSelect}
            style={{ paddingVertical: 0 }}
            elevation="1"
            leading={<CachedSvgUri width={50} height={50} uri={flag} />}>
            <ThemedText type="onPrimary">{language}</ThemedText>
        </GlassCardSelection>
    );
}

export default function ChooseLanguageOnboarding() {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
        null
    );

    const insets = useSafeAreaInsets();

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
                            marginBottom: 24,
                            marginTop: ONBOARDING_APPBAR_HEIGHT + insets.top,
                        }}>
                        <BrandText
                            onPrimary
                            large
                            style={[{ paddingBottom: 4, fontSize: 28 }]}>
                            Choose a language to learn
                        </BrandText>
                        <ThemedText type="onPrimarySecondary">
                            Which language will empower your future?
                        </ThemedText>
                    </View>
                }
                renderItem={({ item }) => (
                    <ChooseLanguageCard
                        selected={selectedLanguage == item.language}
                        {...item}
                        onSelect={() => {
                            setSelectedLanguage(
                                selectedLanguage == item.language
                                    ? null
                                    : item.language
                            );
                        }}
                    />
                )}
                keyExtractor={(item) => item.language}
                contentContainerStyle={{
                    paddingBottom: 12,
                    gap: 8,
                    flexGrow: 1,
                    paddingHorizontal: 24,
                }}
                ListFooterComponent={
                    <View>
                        <Button
                            href={`/onboarding/choose-fluency?language=${selectedLanguage}`}
                            style={{
                                flex: 0,
                                marginBottom: 12 + insets.bottom,
                                marginTop: 36,
                            }}
                            disabled={selectedLanguage === null}
                            variant="primaryVariant">
                            <ButtonText>Continue</ButtonText>
                        </Button>
                    </View>
                }
            />
        </OnboardingLayout>
    );
}
