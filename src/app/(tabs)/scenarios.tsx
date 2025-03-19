import ScenarioCard from "@/components/scenarios/ScenarioCard";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { AIScenario } from "@/context/ScenariosContext";
import { useCurrentCourse } from "@/hooks/course";
import useAppbarSafeAreaInsets, {
    useBottomNavSafeAreaInsets,
} from "@/hooks/useAppbarSafeAreaInsets";
import { mascot } from "@/utils/cache/CachedImages";
import axios from "axios";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Animated from "react-native-reanimated";

export default function ScenariosTab() {
    const insets = useBottomNavSafeAreaInsets();
    const course = useCurrentCourse();
    const { t } = useTranslation();

    const [data, setData] = useState<AIScenario[]>([]);

    const fetchData = useCallback(async () => {
        if (!course.currentCourse) {
            return;
        }

        const response = await axios.get(
            `/v1/courses/${course.currentCourse.id}/scenarios`
        );

        setData(response.data.data);
    }, [course]);

    const organizedData = useMemo(() => {
        if (!data) return [];

        // Organize by difficulty
        const organized = {
            beginner: {
                title: t("scenarios.beginner"),
                data: [] as AIScenario[],
            },
            intermediate: {
                title: t("scenarios.intermediate"),
                data: [] as AIScenario[],
            },
            advanced: {
                title: t("scenarios.advanced"),
                data: [] as AIScenario[],
            },
            fluent: {
                title: t("scenarios.fluent"),
                data: [] as AIScenario[],
            },
        };

        for (const item of data) {
            organized[item.type].data.push(item as AIScenario);
        }

        return [
            organized.beginner,
            organized.intermediate,
            organized.advanced,
            organized.fluent,
        ];
    }, [data]);

    useEffect(() => {
        fetchData();
    }, []);

    if (!course) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <FlatList
            data={organizedData}
            renderItem={({ item }) => (
                <View>
                    <ThemedText
                        type="defaultSemiBold"
                        style={{
                            paddingHorizontal: 24,
                            paddingBottom: 8,
                            fontSize: 18,
                        }}>
                        {item.title}
                    </ThemedText>
                    <FlatList
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            gap: 8,
                        }}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={item.data}
                        renderItem={({ item }) => <ScenarioCard data={item} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 24,
                gap: 16,
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
