import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import useHaptics from "@/hooks/useHaptics";
import { saveUserCache } from "@/utils/cache/user-cache";
import axios from "axios";
import { NotificationFeedbackType } from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function SuccessSubscriptionPage() {
    const { t } = useTranslation();
    const auth = useAuth();

    const [loading, setLoading] = useState(true);
    const haptics = useHaptics();

    const fetchUser = useCallback(async () => {
        try {
            const me = await axios.get("/v1/auth/me");

            if (me.status == 200) {
                haptics.notificationAsync(NotificationFeedbackType.Success);

                auth.setUser(me.data.user);

                await saveUserCache({
                    user: me.data.user,
                });
            }
        } catch (e) {
            console.error(e);
            haptics.notificationAsync(NotificationFeedbackType.Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <View style={styles.textWrapper}>
                <ThemedText type="heading" style={styles.text}>
                    {t("subscription.thanks")}
                </ThemedText>
                <ThemedText type="secondary" style={styles.text}>
                    {t("subscription.thanks_description")}
                </ThemedText>
            </View>
            <Button
                loading={loading}
                onPress={() => {
                    router.dismiss();
                }}>
                <ButtonText>{t("continue")}</ButtonText>
            </Button>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    text: {
        textAlign: "left",
    },
    textWrapper: {
        gap: 4,
        marginBottom: 24,
    },
});
