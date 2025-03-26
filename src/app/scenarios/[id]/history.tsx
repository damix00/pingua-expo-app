import ScenarioSessionCard from "@/components/scenarios/ScenarioSessionCard";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { AIScenario, AIScenarioSession } from "@/context/ScenariosContext";
import { useCurrentCourse } from "@/hooks/course";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import axios from "axios";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function ScenarioHistoryPage() {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const { t } = useTranslation();
    const navigation = useNavigation();

    const course = useCurrentCourse();
    const colors = useThemeColors();
    const insets = useAppbarSafeAreaInsets();

    const [data, setData] = useState<AIScenarioSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            title: t("scenarios.history.title"),
        });
    }, [t]);

    const fetchData = useCallback(async () => {
        if (!course || !course.currentCourse) return;

        try {
            // Fetch data
            const response = await axios.get(
                `/v1/courses/${course.currentCourse.id}/scenarios/${id}/history`
            );

            if (response.status != 200) {
                throw new Error("Failed to fetch data");
            }

            setHasMore(response.data.sessions.length > 0);
            setData(response.data.sessions || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: t("errors.something_went_wrong"),
            });
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchMore = useCallback(async () => {
        if (loading || loadingMore) return;
        if (!hasMore || !course || !course.currentCourse) return;

        setLoadingMore(true);

        try {
            // Fetch data
            const response = await axios.get(
                `/v1/courses/${course.currentCourse.id}/scenarios/${id}/history`,
                {
                    params: {
                        offset: data[data.length - 1].id,
                    },
                }
            );

            if (response.status != 200) {
                throw new Error("Failed to fetch data");
            }

            setData((prevData) => [...prevData, ...response.data.sessions]);
            setLoadingMore(false);
            setHasMore(response.data.sessions.length > 0);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: t("errors.something_went_wrong"),
            });
        }
    }, [loading, loadingMore, hasMore, course]);

    if (loading || data.length == 0) {
        return (
            <ThemedView
                style={[
                    styles.page,
                    {
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}>
                {!loading && data.length == 0 && (
                    <ThemedText>{t("scenarios.history.no_data")}</ThemedText>
                )}
                {loading && <ActivityIndicator />}
            </ThemedView>
        );
    }

    return (
        <FlatList
            style={[
                styles.page,
                {
                    backgroundColor: colors.background,
                },
            ]}
            contentContainerStyle={{
                paddingTop: insets.top + 16,
                paddingBottom: insets.bottom + 16,
                paddingHorizontal: 16,
                gap: 8,
            }}
            onEndReached={fetchMore}
            data={[
                ...data,
                {
                    _internal_ignore: true,
                    id: "loadingMore",
                },
            ]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                if ("_internal_ignore" in item && item._internal_ignore) {
                    if (loadingMore) {
                        return <ActivityIndicator />;
                    }
                    return null;
                }

                if ("_internal_ignore" in item) {
                    return null;
                }
                return <ScenarioSessionCard {...(item as AIScenarioSession)} />;
            }}
        />
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
});
