import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { savePreferences, usePreferences } from "@/context/PreferencesContext";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import { saveUserCache } from "@/utils/cache/user-cache";
import { formatDate } from "@/utils/util";
import axios from "axios";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";

export default function PremiumSettingsPage() {
    const colors = useThemeColors();
    const insets = useAppbarSafeAreaInsets();
    const { t, i18n } = useTranslation();
    const auth = useAuth();

    const preferences = usePreferences();

    const handleCancel = useCallback(() => {
        Alert.alert(
            t("settings.premium.cancel"),
            t("settings.premium.cancelPrompt"),
            [
                {
                    text: t("settings.premium.keepSubscription"),
                    style: "cancel",
                },
                {
                    text: t("settings.premium.cancelSubscription"),
                    style: "destructive",
                    onPress: async () => {
                        const result = await axios.delete("/v1/subscriptions");

                        if (result.status == 200 && auth.user) {
                            auth.setUser({
                                ...auth.user,
                                plan: "FREE",
                                planExpiresAt: null,
                            });

                            await saveUserCache({
                                user: {
                                    ...auth.user,
                                    plan: "FREE",
                                    planExpiresAt: null,
                                },
                            });
                        }
                    },
                },
            ]
        );
    }, []);

    return (
        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingTop: insets.top + 8,
                },
            ]}>
            <View
                style={{
                    gap: 2,
                    marginBottom: 16,
                }}>
                <ThemedText type="heading" style={{ fontSize: 24 }}>
                    {t("settings.premium.heading")}
                </ThemedText>
                <ThemedText type="secondary">
                    {t("settings.premium.renews", {
                        date: formatDate(
                            new Date(auth.user?.planExpiresAt || Date.now())
                        ),
                    })}
                </ThemedText>
            </View>
            <Button onPress={handleCancel}>
                <ButtonText>{t("settings.premium.cancel")}</ButtonText>
            </Button>
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
