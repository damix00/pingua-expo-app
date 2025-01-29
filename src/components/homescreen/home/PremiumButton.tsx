import { useAuth } from "@/context/AuthContext";
import React from "react";
import Chip from "../../ui/Chip";
import { ThemedText } from "../../ui/ThemedText";
import { StyleSheet, View } from "react-native";
import HapticTouchableOpacity from "../../input/button/HapticTouchableOpacity";
import { router } from "expo-router";
import { Gem } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";

export default function PremiumButton() {
    const auth = useAuth();
    const colors = useThemeColors();
    const { t } = useTranslation();

    if (auth.user?.plan != "FREE") {
        return <></>;
    }

    return (
        <HapticTouchableOpacity
            style={styles.container}
            onPress={() => {
                router.push("/modals/subscription");
            }}>
            <Chip>
                {/* <Gem size={14} color={colors.primary} /> */}
                <ThemedText
                    type="primary"
                    style={{
                        fontSize: 12,
                    }}>
                    {t("subscription.subscribe")}
                </ThemedText>
            </Chip>
        </HapticTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
});
