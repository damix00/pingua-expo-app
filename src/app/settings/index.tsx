import OverlayDropdown from "@/components/input/stateful/OverlayDropdown";
import {
    SettingsCheckboxItem,
    SettingsDropdownItem,
    SettingsItem,
} from "@/components/settings/SettingsItems";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { savePreferences, usePreferences } from "@/context/PreferencesContext";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import { appLanguages, languageMap, saveLocale } from "@/utils/i18n";
import { ChevronDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
    Appearance,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    View,
} from "react-native";

export default function SettingsPage() {
    const colors = useThemeColors();
    const insets = useAppbarSafeAreaInsets();
    const { t, i18n } = useTranslation();

    const preferences = usePreferences();

    return (
        <ScrollView
            contentContainerStyle={styles.contentContainer}
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingTop: insets.top,
                },
            ]}>
            <SettingsCheckboxItem
                checked={preferences.preferences.hapticFeedback}
                onChange={async (value) => {
                    preferences.setPreferences({
                        hapticFeedback: value,
                    });

                    await savePreferences({
                        hapticFeedback: value,
                    });
                }}
                title={t("settings.hapticFeedback")}
            />
            <SettingsDropdownItem
                items={appLanguages.map((lang) => ({
                    label: languageMap[lang as keyof typeof languageMap],
                    value: lang,
                }))}
                selectedValue={i18n.language}
                onSelect={async (value) => {
                    i18n.changeLanguage(value);
                    await saveLocale(value);
                }}
                title={t("settings.language")}
            />
            <SettingsDropdownItem
                items={[
                    {
                        label: t("settings.deviceDefault"),
                        value: "system",
                    },
                    {
                        label: t("settings.light"),
                        value: "light",
                    },
                    {
                        label: t("settings.dark"),
                        value: "dark",
                    },
                ]}
                selectedValue={
                    preferences.preferences.darkMode == "system"
                        ? "system"
                        : preferences.preferences.darkMode == "false"
                        ? "light"
                        : "dark"
                }
                onSelect={async (value) => {
                    const transformedValue =
                        value == "system"
                            ? "system"
                            : value == "light"
                            ? "false"
                            : "true";

                    preferences.setPreferences({
                        darkMode: transformedValue,
                    });

                    Appearance.setColorScheme(
                        value == "system" ? null : (value as any)
                    );

                    await savePreferences({
                        darkMode: transformedValue,
                    });
                }}
                title={t("settings.darkMode")}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    contentContainer: {
        flexGrow: 1,
        gap: 16,
        paddingTop: 16,
    },
});
