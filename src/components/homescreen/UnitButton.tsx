import { useThemeColors } from "@/hooks/useThemeColor";
import HapticTouchableOpacity from "../input/button/HapticTouchableOpacity";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Check } from "lucide-react-native";
import BrandText from "../ui/BrandText";
import { ThemedText } from "../ui/ThemedText";
import { useTranslation } from "react-i18next";
import { addZero } from "@/utils/util";
import { useUnitTitle } from "@/hooks/course";
import { SectionData } from "@/context/AuthContext";

export default function UnitButton({
    currentXp,
    xp,
    shouldContinue,
    completed,
    onPress,
    lastCompletedIndex,
    index,
    sectionData,
}: {
    currentXp: number;
    xp: number;
    shouldContinue: boolean;
    completed: boolean;
    onPress: () => void;
    lastCompletedIndex: number;
    index: number;
    sectionData: SectionData;
}) {
    const { t } = useTranslation();
    const colors = useThemeColors();

    const title = useUnitTitle(sectionData, index);

    return (
        <TouchableOpacity
            disabled={(!shouldContinue && !completed) || completed}>
            <View
                style={[
                    styles.unitButton,
                    {
                        opacity: shouldContinue || completed ? 1 : 0.5,
                    },
                ]}>
                <View
                    style={[
                        {
                            backgroundColor: completed
                                ? colors.primary
                                : colors.primaryContainer,
                        },
                        styles.iconContainer,
                    ]}>
                    {completed ? (
                        <Check size={24} color={colors.textOnPrimary} />
                    ) : (
                        <BrandText
                            style={{
                                color: colors.primary,
                                fontSize: 16,
                            }}>
                            {addZero(index + 1)}
                        </BrandText>
                    )}
                </View>
                <ThemedText>
                    {/* {completed
                        ? t("course.completed_unit", { unit: index + 1 })
                        : shouldContinue
                        ? t("course.continue_unit", {
                              unit: index + 1,
                          })
                        : t("course.unavailable_unit", {
                              unit: lastCompletedIndex + 1,
                          })} */}
                    {title}
                </ThemedText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    unitButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: 8,
        gap: 8,
    },
    unitButtonIcon: {
        marginRight: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
});
