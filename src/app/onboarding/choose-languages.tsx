import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedText } from "@/components/ui/ThemedText";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import OnboardingLayout from "./OnboardingLayout";
import BrandText from "@/components/ui/BrandText";
import GlassCard, { GlassCardSelection } from "@/components/ui/GlassCard";
import twemoji from "@twemoji/api";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { SvgUri } from "react-native-svg";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CachedSvgUri } from "@/utils/cache/SVGCache";

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
        language: "Spanish",
        flag: `${twemoji.base}svg/1f1ea-1f1f8.svg`,
    },
    {
        language: "Croatian",
        flag: `${twemoji.base}svg/1f1ed-1f1f7.svg`,
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

    // hello

    // {
    //     language: "English",
    //     flag: `${twemoji.base}svg/1f1ec-1f1e7.svg`,
    // },
    // {
    //     language: "German",
    //     flag: `${twemoji.base}svg/1f1e9-1f1ea.svg`,
    // },
    // {
    //     language: "Spanish",
    //     flag: `${twemoji.base}svg/1f1ea-1f1f8.svg`,
    // },
    // {
    //     language: "Croatian",
    //     flag: `${twemoji.base}svg/1f1ed-1f1f7.svg`,
    // },
    // {
    //     language: "French",
    //     flag: `${twemoji.base}svg/1f1eb-1f1f7.svg`,
    // },
    // {
    //     language: "Italian",
    //     flag: `${twemoji.base}svg/1f1ee-1f1f9.svg`,
    // },
    // {
    //     language: "Russian",
    //     flag: `${twemoji.base}svg/1f1f7-1f1fa.svg`,
    // },
    // {
    //     language: "English",
    //     flag: `${twemoji.base}svg/1f1ec-1f1e7.svg`,
    // },
    // {
    //     language: "German",
    //     flag: `${twemoji.base}svg/1f1e9-1f1ea.svg`,
    // },
    // {
    //     language: "Spanish",
    //     flag: `${twemoji.base}svg/1f1ea-1f1f8.svg`,
    // },
    // {
    //     language: "Croatian",
    //     flag: `${twemoji.base}svg/1f1ed-1f1f7.svg`,
    // },
    // {
    //     language: "French",
    //     flag: `${twemoji.base}svg/1f1eb-1f1f7.svg`,
    // },
    // {
    //     language: "Italian",
    //     flag: `${twemoji.base}svg/1f1ee-1f1f9.svg`,
    // },
    // {
    //     language: "Russian",
    //     flag: `${twemoji.base}svg/1f1f7-1f1fa.svg`,
    // },
    // {
    //     language: "English",
    //     flag: `${twemoji.base}svg/1f1ec-1f1e7.svg`,
    // },
    // {
    //     language: "German",
    //     flag: `${twemoji.base}svg/1f1e9-1f1ea.svg`,
    // },
    // {
    //     language: "Spanish",
    //     flag: `${twemoji.base}svg/1f1ea-1f1f8.svg`,
    // },
    // {
    //     language: "Croatian",
    //     flag: `${twemoji.base}svg/1f1ed-1f1f7.svg`,
    // },
    // {
    //     language: "French",
    //     flag: `${twemoji.base}svg/1f1eb-1f1f7.svg`,
    // },
    // {
    //     language: "Italian",
    //     flag: `${twemoji.base}svg/1f1ee-1f1f9.svg`,
    // },
    // {
    //     language: "Russian",
    //     flag: `${twemoji.base}svg/1f1f7-1f1fa.svg`,
    // },
    // {
    //     language: "English",
    //     flag: `${twemoji.base}svg/1f1ec-1f1e7.svg`,
    // },
    // {
    //     language: "German",
    //     flag: `${twemoji.base}svg/1f1e9-1f1ea.svg`,
    // },
    // {
    //     language: "Spanish",
    //     flag: `${twemoji.base}svg/1f1ea-1f1f8.svg`,
    // },
    // {
    //     language: "Croatian",
    //     flag: `${twemoji.base}svg/1f1ed-1f1f7.svg`,
    // },
    // {
    //     language: "French",
    //     flag: `${twemoji.base}svg/1f1eb-1f1f7.svg`,
    // },
    // {
    //     language: "Italian",
    //     flag: `${twemoji.base}svg/1f1ee-1f1f9.svg`,
    // },
    // {
    //     language: "Russian",
    //     flag: `${twemoji.base}svg/1f1f7-1f1fa.svg`,
    // },
    // {
    //     language: "English",
    //     flag: `${twemoji.base}svg/1f1ec-1f1e7.svg`,
    // },
    // {
    //     language: "German",
    //     flag: `${twemoji.base}svg/1f1e9-1f1ea.svg`,
    // },
    // {
    //     language: "Spanish",
    //     flag: `${twemoji.base}svg/1f1ea-1f1f8.svg`,
    // },
    // {
    //     language: "Croatian",
    //     flag: `${twemoji.base}svg/1f1ed-1f1f7.svg`,
    // },
    // {
    //     language: "French",
    //     flag: `${twemoji.base}svg/1f1eb-1f1f7.svg`,
    // },
    // {
    //     language: "Italian",
    //     flag: `${twemoji.base}svg/1f1ee-1f1f9.svg`,
    // },
    // {
    //     language: "Russian",
    //     flag: `${twemoji.base}svg/1f1f7-1f1fa.svg`,
    // },
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
        <HapticTouchableOpacity
            onPress={() => {
                onSelect();
            }}>
            <GlassCardSelection
                selected={selected}
                onSelect={onSelect}
                style={{ paddingVertical: 0 }}
                elevation="1"
                leading={<CachedSvgUri width={50} height={50} uri={flag} />}>
                <ThemedText type="onPrimary">{language}</ThemedText>
            </GlassCardSelection>
        </HapticTouchableOpacity>
    );
}

export default function ChooseLanguageOnboarding() {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
        null
    );

    return (
        <OnboardingLayout appbar>
            <View
                style={{
                    flex: 1,
                    justifyContent: "space-between",
                }}>
                <View>
                    <BrandText
                        onPrimary
                        large
                        style={[{ paddingBottom: 4, fontSize: 28 }]}>
                        Choose a language to learn
                    </BrandText>
                    <ThemedText type="onPrimarySecondary">
                        Which language will empower your future?
                    </ThemedText>
                    <View style={{ marginTop: 24, gap: 8 }}>
                        {languages.map((language) => (
                            <ChooseLanguageCard
                                key={language.language}
                                selected={selectedLanguage == language.language}
                                {...language}
                                onSelect={() => {
                                    setSelectedLanguage(
                                        selectedLanguage == language.language
                                            ? null
                                            : language.language
                                    );
                                }}
                            />
                        ))}
                    </View>
                </View>
                <Button
                    style={{
                        marginBottom: 12,
                    }}
                    disabled={selectedLanguage === null}
                    variant="primaryVariant">
                    <ButtonText>Continue</ButtonText>
                </Button>
            </View>
        </OnboardingLayout>
    );
}
