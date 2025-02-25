import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import OverlayDropdown from "@/components/input/stateful/OverlayDropdown";
import TextInput from "@/components/input/TextInput";
import { ThemedText } from "@/components/ui/ThemedText";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import axios from "axios";
import { ArrowDownUp, ChevronsUpDown } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

function LanguageSelectButton({
    label,
    language,
    exclude,
    onSelect,
}: {
    label: string;
    language: string;
    onSelect: (value: string) => any;
    exclude: string;
}) {
    const colors = useThemeColors();
    const { t } = useTranslation();

    const languages = useMemo(
        () =>
            [
                "en",
                "hr",
                "de",
                "es",
                "fr",
                "it",
                "ru",
                "pt",
                "tr",
                "el",
                "nl",
                "pl",
                "sv",
            ].filter((lang) => lang != exclude),
        [exclude]
    );

    return (
        <OverlayDropdown
            items={languages.map((lang) => ({
                label: t(`languages.${lang}`),
                value: lang,
            }))}
            onSelect={onSelect}
            selectedValue={language}>
            <View style={styles.selectBtn}>
                <ThemedText
                    fontWeight="700"
                    style={[styles.langText, { color: colors.textSecondary }]}>
                    {label}
                    <ThemedText
                        fontWeight="700"
                        style={[styles.langText, { color: colors.text }]}>
                        {" " + t(`languages.${language}`)}
                    </ThemedText>
                </ThemedText>
                <ChevronsUpDown size={16} color={colors.textSecondary} />
            </View>
        </OverlayDropdown>
    );
}

export default function TranslateTab() {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const insets = useAppbarSafeAreaInsets();

    const [from, setFrom] = useState("en");
    const [to, setTo] = useState("hr");

    const [loading, setLoading] = useState(false);
    const [translated, setTranslated] = useState("");

    const fromText = useRef("");

    const handleTranslate = useCallback(async () => {
        if (fromText.current.length == 0) return;

        setLoading(true);

        const resp = await axios.post("/v1/translations", {
            text: fromText.current,
            fromLanguage: from,
            toLanguage: to,
        });

        if (resp.status == 200) {
            setTranslated(resp.data.translation);
        }

        setLoading(false);
    }, []);

    return (
        <KeyboardAwareScrollView
            keyboardDismissMode="on-drag"
            style={{
                backgroundColor: colors.background,
                flex: 1,
                paddingHorizontal: 24,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}>
            <View style={[styles.card]}>
                <LanguageSelectButton
                    exclude={to}
                    label={t("translation.from")}
                    language={from}
                    onSelect={(v) => {
                        setFrom(v);
                    }}
                />

                <TextInput
                    onChangeText={(text) => {
                        fromText.current = text;
                    }}
                    multiline
                    style={[
                        styles.innerCard,
                        styles.textContent,
                        {
                            backgroundColor: colors.backgroundVariant,
                        },
                    ]}
                />
            </View>
            <View
                style={[
                    styles.divider,
                    {
                        backgroundColor: colors.outline,
                    },
                ]}
            />
            <View style={[styles.card]}>
                <LanguageSelectButton
                    exclude={from}
                    label={t("translation.to")}
                    language={to}
                    onSelect={(v) => {
                        setTo(v);
                    }}
                />

                {loading ? (
                    <ActivityIndicator
                        color={colors.primary}
                        style={{ marginVertical: 4 }}
                    />
                ) : (
                    <View
                        style={[
                            styles.innerCard,
                            {
                                backgroundColor: colors.backgroundVariant,
                                marginTop: 4,
                                paddingVertical: 0,
                            },
                        ]}>
                        <ThemedText
                            selectable
                            selectionColor={colors.primary}
                            style={styles.textContent}>
                            {translated}
                        </ThemedText>
                    </View>
                )}
            </View>
            <View style={styles.buttonWrapper}>
                <Button onPress={handleTranslate}>
                    <ButtonText>{t("translation.translate")}</ButtonText>
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    selectBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    langText: {
        fontSize: 14,
    },
    card: {
        borderRadius: 8,
        paddingVertical: 12,
    },
    divider: {
        height: 1,
        marginVertical: 8,
        marginHorizontal: 8,
    },
    textContent: {
        fontSize: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    innerCard: {
        height: undefined,
        minHeight: 48,
        paddingVertical: 12,
        borderWidth: 0,
        marginBottom: 4,
        borderRadius: 4,
    },
    buttonWrapper: {
        marginTop: 16,
    },
});
