import { View } from "react-native";
import { ThemedText } from "../../ui/ThemedText";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";

export default function XPProgressBar({
    currentUnit,
    currentLevel,
    xp,
    xpToAdvance,
    sectionCount,
}: {
    currentUnit: number;
    currentLevel: number;
    xp: number;
    xpToAdvance: number;
    sectionCount: number;
}) {
    const { t } = useTranslation();
    const colors = useThemeColors();

    return (
        <View style={styles.container}>
            <View style={styles.topText}>
                <ThemedText style={styles.text}>
                    {t("course.unit", { unit: Math.floor(xp / 10) + 1 })}
                </ThemedText>
                {currentLevel < sectionCount && (
                    <ThemedText type="secondary" style={styles.text}>
                        {t("course.xpToLevel", {
                            xp: xpToAdvance - xp,
                            level: currentLevel + 1,
                        })}
                    </ThemedText>
                )}
            </View>
            <View
                style={[
                    styles.progressContainer,
                    {
                        backgroundColor: colors.primaryContainer,
                    },
                ]}>
                <View
                    style={[
                        styles.progress,
                        {
                            width: `${(xp / xpToAdvance) * 100}%`,
                            backgroundColor: colors.primary,
                        },
                    ]}
                />
            </View>
            <View style={styles.bottomText}>
                <ThemedText type="secondary" style={styles.textSmaller}>
                    {t("course.xp", { xp })}
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    topText: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 4,
    },
    bottomText: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingTop: 4,
    },
    progressContainer: {
        height: 8,
        borderRadius: 4,
    },
    progress: {
        height: "100%",
        borderRadius: 4,
    },
    text: {
        fontSize: 14,
    },
    textSmaller: {
        fontSize: 12,
    },
});
