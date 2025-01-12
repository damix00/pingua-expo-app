import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useCurrentCourse, useSectionTitle } from "@/hooks/course";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useEffect, useMemo, useRef } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UnitButton from "@/components/homescreen/UnitButton";
import XPProgressBar from "@/components/homescreen/XPProgressBar";

export default function Index() {
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

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

    return (
        <FlatList
            onLayout={() => {}}
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
                gap: 16,
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
                const nextItem = units[index + 1] || null;
                const lastCompletedIndex = units.findIndex(
                    (unit) => unit.completed
                );

                const shouldContinue =
                    (previousItem?.completed &&
                        !item.completed &&
                        index != 0) ||
                    (index == 0 &&
                        !nextItem?.completed &&
                        nextItem.xp < currentCourse.xp);

                return (
                    <UnitButton
                        currentXp={currentCourse.xp}
                        lastCompletedIndex={
                            lastCompletedIndex == -1 ? 0 : lastCompletedIndex
                        }
                        xp={item.xp}
                        shouldContinue={shouldContinue}
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
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 8,
        gap: 12,
    },
});
