import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useCurrentCourse, useSectionTitle } from "@/hooks/course";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useEffect, useMemo, useRef } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { Check, Circle } from "lucide-react-native";
import { useTimeout } from "@/hooks/useTimeout";
import UnitButton from "@/components/homescreen/UnitButton";
import XPProgressBar from "@/components/homescreen/XPProgressBar";

export default function Index() {
    const auth = useAuth();
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);
    const jumped = useRef(false);

    const { currentCourse, currentCourseData } = useCurrentCourse();
    const title = useSectionTitle(currentCourseData);

    const units = useMemo(() => {
        const data = [];

        for (let i = 0; i < currentCourseData.unitCount; i++) {
            // Each unit takes 10 XP to complete
            const xp = (i + 1) * 10;

            data.push({
                xp,
                completed: currentCourse.xp >= xp,
            });
        }

        return data;
    }, [currentCourse, currentCourseData]);

    const currentUnit = useMemo(() => {
        const index = units.findIndex((unit) => !unit.completed);

        return index === -1 ? 0 : index;
    }, [units]);

    useEffect(() => {
        if (jumped.current) {
            return;
        }

        const index = units.findIndex((unit) => !unit.completed);

        if (flatListRef.current && index !== -1) {
            flatListRef.current.scrollToIndex({
                index,
                animated: false,
            });
            jumped.current = true;
        }
    }, [units]);

    return (
        <FlatList
            ref={flatListRef}
            style={[
                {
                    paddingTop:
                        insets.top + (Platform.OS === "ios" ? 54 : 72) + 16,
                },
                styles.container,
            ]}
            contentContainerStyle={{
                paddingBottom: insets.bottom + 16 + 56,
                gap: 12,
            }}
            data={units}
            keyExtractor={(data) => data.xp.toString()}
            ListHeaderComponent={() => (
                <View style={styles.header}>
                    <ThemedText type="heading">{title}</ThemedText>
                    <XPProgressBar
                        currentUnit={currentUnit + 1}
                        currentLevel={currentCourse.level}
                        xp={currentCourse.xp}
                        xpToAdvance={currentCourseData.unitCount * 10}
                    />
                </View>
            )}
            renderItem={({ item, index }) => {
                const previousItem = units[index - 1] || null;
                const lastCompletedIndex = units.findIndex(
                    (unit) => unit.completed
                );

                return (
                    <UnitButton
                        currentXp={currentCourse.xp}
                        lastCompletedIndex={
                            lastCompletedIndex == -1 ? 0 : lastCompletedIndex
                        }
                        xp={item.xp}
                        shouldContinue={previousItem?.completed || index === 0}
                        completed={item.completed}
                        onPress={() => {}}
                        index={index}
                        sectionData={currentCourseData}
                    />
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 22,
    },
    header: {
        marginBottom: 8,
        gap: 12,
    },
});
