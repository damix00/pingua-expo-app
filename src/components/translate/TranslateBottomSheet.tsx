import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/ThemedText";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react-native";
import axios from "axios";
import OverlayDropdown from "../input/stateful/OverlayDropdown";

interface TranslateBottomSheetProps {
    fromLanguage: string;
    toLanguage: string;
    fromText: string;
    toText?: string;
}

function LanguageSelectButton({
    label,
    language,
    onSelect,
}: {
    label: string;
    language: string;
    onSelect: (value: string) => any;
}) {
    const colors = useThemeColors();
    const { t } = useTranslation();

    const languages = useMemo(
        () => [
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
        ],
        []
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

export default function TranslateBottomSheet({
    fromLanguage,
    toLanguage,
    fromText,
    toText,
}: TranslateBottomSheetProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const colors = useThemeColors();

    const [from, setFrom] = useState(fromLanguage);
    const [to, setTo] = useState(toLanguage);
    const [loading, setLoading] = useState(!toText);
    const [translated, setTranslated] = useState(toText);

    const prevFrom = useRef(fromLanguage);
    const prevTo = useRef(toLanguage);

    const load = useCallback(async () => {
        setLoading(true);

        const resp = await axios.post("/v1/translations", {
            text: fromText,
            fromLanguage: from,
            toLanguage: to,
        });

        if (resp.status == 200) {
            setTranslated(resp.data.translation);
        }

        setLoading(false);
    }, [fromText, from, to]);

    useEffect(() => {
        if (!toText) {
            load();
        }
    }, [toText]);

    useEffect(() => {
        if (from !== prevFrom.current || to !== prevTo.current) {
            load();
            prevFrom.current = from;
            prevTo.current = to;
        }
    }, [from, to]);

    return (
        <BottomSheetScrollView
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                {
                    paddingBottom: insets.bottom + 16,
                },
                styles.content,
            ]}>
            <ThemedText type="subtitle" style={styles.title}>
                {t("translate")}
            </ThemedText>

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.backgroundVariant,
                    },
                ]}>
                <LanguageSelectButton
                    label={t("translation.from")}
                    language={from}
                    onSelect={(v) => {
                        setFrom(v);
                    }}
                />

                <ThemedText
                    selectable
                    selectionColor={colors.primary}
                    style={styles.textContent}>
                    {fromText}
                </ThemedText>

                <View
                    style={[
                        styles.divider,
                        { backgroundColor: colors.outline },
                    ]}
                />

                <LanguageSelectButton
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
                    <ThemedText
                        selectable
                        selectionColor={colors.primary}
                        style={styles.textContent}>
                        {translated}
                    </ThemedText>
                )}
            </View>
        </BottomSheetScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
    },
    title: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        fontSize: 16,
        flexDirection: "row",
        textAlign: "center",
    },
    card: {
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
    },
    langText: {
        fontSize: 12,
    },
    textContent: {
        marginTop: 8,
        fontSize: 16,
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    selectBtn: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 4,
        alignItems: "center",
    },
});
