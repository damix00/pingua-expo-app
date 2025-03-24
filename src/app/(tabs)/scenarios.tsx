import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import ScenarioCard from "@/components/scenarios/ScenarioCard";
import ScenariosSkeleton from "@/components/scenarios/ScenariosSkeleton";
import { ThemedView } from "@/components/ThemedView";
import Chip from "@/components/ui/chip/Chip";
import SelectableChip from "@/components/ui/chip/SelectableChip";
import { ThemedText } from "@/components/ui/ThemedText";
import { AIScenario, useScenarios } from "@/context/ScenariosContext";
import { useCurrentCourse } from "@/hooks/course";
import useAppbarSafeAreaInsets, {
    useBottomNavSafeAreaInsets,
} from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import { mascot } from "@/utils/cache/CachedImages";
import axios from "axios";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";

enum FilterType {
    ALL = "all",
    UNFINISHED = "unfinished",
    NOT_STARTED = "not_started",
    FINISHED = "finished",
}

export default function ScenariosTab() {
    const insets = useBottomNavSafeAreaInsets();
    const course = useCurrentCourse();
    const { t } = useTranslation();
    const scenarios = useScenarios();
    const colors = useThemeColors();
    const [refreshing, setRefreshing] = useState(false);

    const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
    const filterRef = useRef<FilterType>(filterType);

    const fetchData = useCallback(
        async (updateLoading: boolean = false) => {
            if (!course.currentCourse) {
                return;
            }

            scenarios.setState({
                ...scenarios,
                error: false,
                ...(updateLoading ? { loading: true } : {}),
            });

            setRefreshing(true);

            try {
                const response = await axios.get(
                    `/v1/courses/${course.currentCourse.id}/scenarios?filter=${filterRef.current}`
                );

                scenarios.setState({
                    loading: false,
                    error: false,
                    scenarios: response.data.data,
                });
            } catch (e) {
                scenarios.setState({
                    loading: false,
                    error: true,
                    scenarios: [],
                });
            } finally {
                setRefreshing(false);
            }
        },
        [course]
    );

    const organizedData = useMemo(() => {
        if (!scenarios.scenarios) return [];

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

        for (const item of scenarios.scenarios) {
            try {
                organized[item.type].data.push(item as AIScenario);
            } catch (e) {
                console.error(e);
            }
        }

        return [
            organized.beginner,
            organized.intermediate,
            organized.advanced,
            organized.fluent,
        ].filter((group) => group.data.length > 0);
    }, [scenarios.scenarios]);

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
        <>
            <FlatList
                data={[
                    FilterType.ALL,
                    FilterType.NOT_STARTED,
                    FilterType.UNFINISHED,
                    FilterType.FINISHED,
                ]}
                renderItem={({ item }) => (
                    <SelectableChip
                        text={t(`scenarios.filters.${item}`)}
                        selected={filterType === item}
                        onSelect={() => {
                            if (item == filterType && item == FilterType.ALL) {
                                return;
                            }

                            const newFilter =
                                item === filterType ? FilterType.ALL : item;
                            setFilterType(newFilter);
                            filterRef.current = newFilter;
                            fetchData(true);
                        }}
                    />
                )}
                keyExtractor={(item, index) => item}
                style={[
                    styles.filters,
                    {
                        top: insets.top,
                        backgroundColor: colors.background,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.outline,
                    },
                ]}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    gap: 8,
                    alignItems: "center",
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            {scenarios.loading && <ScenariosSkeleton />}
            {scenarios.error && (
                <ThemedView
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 24,
                        gap: 16,
                    }}>
                    <ThemedText>{t("errors.something_went_wrong")}</ThemedText>
                    <Button onPress={() => fetchData(true)}>
                        <ButtonText>{t("retry")}</ButtonText>
                    </Button>
                </ThemedView>
            )}
            {!scenarios.loading &&
                !scenarios.error &&
                (scenarios.scenarios.length == 0 ? (
                    <ThemedView
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 24,
                            gap: 16,
                        }}>
                        <ThemedText>{t("scenarios.no_scenarios")}</ThemedText>
                    </ThemedView>
                ) : (
                    <FlatList
                        style={{ marginTop: 42 }}
                        data={organizedData}
                        refreshControl={
                            <RefreshControl
                                tintColor={colors.primary}
                                progressViewOffset={insets.top}
                                onRefresh={fetchData}
                                refreshing={refreshing}
                            />
                        }
                        renderItem={({ item }) => (
                            <View>
                                <ThemedText
                                    type="defaultSemiBold"
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingBottom: 8,
                                        fontSize: 18,
                                    }}>
                                    {item.title}
                                </ThemedText>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingHorizontal: 16,
                                        gap: 8,
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={item.data}
                                    renderItem={({ item }) => (
                                        <ScenarioCard data={item} />
                                    )}
                                    keyExtractor={(item, index) =>
                                        index.toString()
                                    }
                                />
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{
                            paddingTop: insets.top + 16,
                            paddingBottom: insets.bottom + 24,
                            gap: 16,
                        }}
                    />
                ))}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filters: {
        position: "absolute",
        height: 42,
        width: "100%",
        zIndex: 100,
    },
});
