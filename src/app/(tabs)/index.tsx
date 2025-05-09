import { ThemedText } from "@/components/ui/ThemedText";
import { useCurrentCourse } from "@/hooks/course";
import { useMemo, useRef } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import UnitButton from "@/components/homescreen/home/UnitButton";
import XPProgressBar from "@/components/homescreen/home/XPProgressBar";
import { getJwt } from "@/api/data";
import { router } from "expo-router";
import { useBottomNavSafeAreaInsets } from "@/hooks/useAppbarSafeAreaInsets";
import { ThemedView } from "@/components/ThemedView";

export default function Index() {
    const insets = useBottomNavSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    const { currentCourse, currentCourseData, title } = useCurrentCourse();

    const units = useMemo(() => {
        const data = [];

        if (!currentCourse || !currentCourseData) {
            return [];
        }

        for (let i = 0; i < currentCourseData?.unitCount; i++) {
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
        if (!units) {
            return 0;
        }

        const index = units.findIndex((unit) => !unit.completed);

        return index === -1 ? 0 : index;
    }, [units]);

    if (!currentCourseData || !currentCourse) {
        return (
            <ThemedView
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ActivityIndicator />
            </ThemedView>
        );
    }

    return (
        <FlatList
            onLayout={() => {}}
            ref={flatListRef}
            style={[
                {
                    paddingTop: insets.top + 24,
                },
                styles.container,
            ]}
            contentContainerStyle={{
                paddingBottom: insets.bottom + 16,
                gap: 16,
            }}
            data={units}
            keyExtractor={(data) => data.xp.toString()}
            ListHeaderComponent={() => (
                <View style={styles.header}>
                    <ThemedText type="heading">{title ?? ""}</ThemedText>
                    <XPProgressBar
                        currentUnit={currentUnit + 1}
                        currentLevel={currentCourse.level}
                        xp={currentCourse.xp}
                        xpToAdvance={currentCourseData.unitCount * 10}
                        sectionCount={currentCourseData.unitCount}
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
                    (index == 0 && !nextItem?.completed && !item.completed);

                return (
                    <UnitButton
                        currentXp={currentCourse.xp}
                        lastCompletedIndex={
                            lastCompletedIndex == -1 ? 0 : lastCompletedIndex
                        }
                        xp={item.xp}
                        shouldContinue={shouldContinue}
                        completed={item.completed}
                        onPress={() => {
                            router.push("/lessons/loading");
                        }}
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
        marginBottom: 4,
        gap: 12,
    },
});
