import OverlayDropdown from "@/components/input/stateful/OverlayDropdown";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { usePreferences } from "@/context/PreferencesContext";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import { appLanguages, languageMap, saveLocale } from "@/utils/i18n";
import { ChevronDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, Switch, View } from "react-native";

export default function SettingsPage() {
    const colors = useThemeColors();
    const insets = useAppbarSafeAreaInsets();
    const { t, i18n } = useTranslation();

    const preferences = usePreferences();

    return (
        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingTop: insets.top,
                },
            ]}>
            <View style={styles.item}>
                <ThemedText>{t("settings.hapticFeedback")}</ThemedText>
                <Switch
                    trackColor={{
                        false: colors.backgroundDarker,
                        true: colors.primary,
                    }}
                    thumbColor={
                        Platform.OS == "ios" ? undefined : colors.background
                    }
                    value={preferences.preferences.hapticFeedback}
                    onValueChange={(value) =>
                        preferences.setPreferences({
                            hapticFeedback: value,
                        })
                    }
                />
            </View>
            <View style={styles.item}>
                <ThemedText>{t("settings.language")}</ThemedText>
                <OverlayDropdown
                    items={appLanguages.map((lang) => ({
                        label: languageMap[lang as keyof typeof languageMap],
                        value: lang,
                    }))}
                    selectedValue={i18n.language}
                    onSelect={async (value) => {
                        i18n.changeLanguage(value);
                        await saveLocale(value);
                    }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}>
                        <ThemedText>
                            {
                                languageMap[
                                    i18n.language as keyof typeof languageMap
                                ]
                            }
                        </ThemedText>
                        <ChevronDown size={16} color={colors.text} />
                    </View>
                </OverlayDropdown>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Platform.select({ ios: 8, android: 4 }),
    },
});
