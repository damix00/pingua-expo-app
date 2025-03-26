import React from "react";
import { AIScenarioSession } from "@/context/ScenariosContext";
import { StyleSheet, View } from "react-native";
import NativeTouchable from "../input/button/NativeTouchable";
import { useTranslation } from "react-i18next";
import { ThemedText } from "../ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { formatDate } from "@/utils/util";
import { router } from "expo-router";

export default function ScenarioSessionCard(props: AIScenarioSession) {
    const { t } = useTranslation();
    const colors = useThemeColors();

    const { id: sessionId, cmsId, completed, success, createdAt } = props;

    return (
        <NativeTouchable
            androidBorderRadius={8}
            onPress={() => {
                router.replace(
                    `/scenarios/${cmsId}/chat?sessionId=${sessionId}`
                );
            }}>
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.backgroundVariant,
                    },
                ]}>
                <ThemedText
                    fontWeight="800"
                    style={{
                        fontSize: 20,
                    }}>
                    {formatDate(new Date(createdAt))}
                </ThemedText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ThemedText type="secondary" style={styles.statusText}>
                        {completed
                            ? t("scenarios.filters.finished")
                            : t("scenarios.filters.unfinished")}
                    </ThemedText>
                    {completed && (
                        <>
                            <ThemedText
                                type="secondary"
                                style={styles.statusText}>
                                {" · "}
                            </ThemedText>
                            <ThemedText
                                style={[
                                    styles.statusText,
                                    {
                                        color: success
                                            ? colors.correct
                                            : colors.error,
                                    },
                                ]}>
                                {success
                                    ? t("scenarios.success")
                                    : t("scenarios.failure")}
                            </ThemedText>
                        </>
                    )}
                </View>
            </View>
        </NativeTouchable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        padding: 16,
        gap: 2,
    },
    statusText: {
        fontSize: 12,
    },
});
