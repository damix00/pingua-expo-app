import { useThemeColors } from "@/hooks/useThemeColor";
import HapticTouchableOpacity from "../../input/button/HapticTouchableOpacity";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Check, LockKeyholeIcon } from "lucide-react-native";
import BrandText from "../../ui/BrandText";
import { ThemedText } from "../../ui/ThemedText";
import { useTranslation } from "react-i18next";
import { addZero } from "@/utils/util";
import { useUnitTitle } from "@/hooks/course";
import { SectionData } from "@/context/AuthContext";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import React from "react";
import NativeTouchable from "@/components/input/button/NativeTouchable";

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
        <NativeTouchable
            onPress={onPress}
            disabled={(!shouldContinue && !completed) || completed}>
            <View
                style={[
                    styles.unitButton,
                    {
                        opacity: shouldContinue || completed ? 1 : 0.5,
                    },
                ]}>
                <AnimatedCircularProgress
                    duration={completed ? 0 : 500}
                    size={56}
                    width={4}
                    rotation={0}
                    childrenContainerStyle={styles.iconProgress}
                    fill={Math.min((currentXp - (xp - 10)) * 10, 100)}
                    tintColor={colors.primary}
                    backgroundColor={colors.primaryContainer}>
                    {() =>
                        completed ? (
                            <Check size={28} color={colors.primary} />
                        ) : (
                            <BrandText
                                style={[
                                    {
                                        color: colors.primary,
                                    },
                                    styles.unitButtonText,
                                ]}>
                                {addZero(index + 1)}
                            </BrandText>
                        )
                    }
                </AnimatedCircularProgress>
                <View style={styles.unitTitleWrapper}>
                    <ThemedText fontWeight={shouldContinue ? "700" : undefined}>
                        {title}
                    </ThemedText>
                    <ThemedText type="secondary" style={{ fontSize: 12 }}>
                        {completed
                            ? t("completed")
                            : `${t("course.unit", { unit: index + 1 })}${
                                  shouldContinue
                                      ? " · " + t("tap_to_continue")
                                      : ""
                              }`}
                    </ThemedText>
                </View>
                {!shouldContinue && !completed && (
                    <LockKeyholeIcon size={20} color={colors.text} />
                )}
            </View>
        </NativeTouchable>
    );
}

const styles = StyleSheet.create({
    unitButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: 8,
        gap: 12,
    },
    unitButtonText: {
        fontSize: 20,
        lineHeight: 28, // size / 2
    },
    iconProgress: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    unitTitleWrapper: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
});
