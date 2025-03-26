import { ThemedText } from "@/components/ui/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useThemeColors } from "@/hooks/useThemeColor";
import GestureDismissableModal from "@/components/modal/GestureDismissableModal";
import { useScenario, useScenarios } from "@/context/ScenariosContext";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import { ChevronLeft, HistoryIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { StatusBar } from "expo-status-bar";
import Chip from "@/components/ui/chip/Chip";
import { useCallback, useState } from "react";
import ScenarioPageHeader from "@/components/scenarios/ScenarioPageHeader";
import NativeTouchable from "@/components/input/button/NativeTouchable";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useCurrentCourse } from "@/hooks/course";

export default function ScenarioScreen() {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const scenario = useScenario(id);
    const scenarios = useScenarios();
    const insets = useSafeAreaInsets();
    const course = useCurrentCourse();

    const colors = useThemeColors();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const handleStart = useCallback(async () => {
        if (!scenario || !course.currentCourse) return;

        if (scenario.session_id && scenario.status == "started") {
            router.replace(
                `/scenarios/${id}/chat?sessionId=${scenario.session_id}`
            );

            return;
        }

        // Create a new session
        try {
            setLoading(true);
            const resp = await axios.post(
                `/v1/courses/${course.currentCourse.id}/scenarios/${id}`
            );

            if (resp.status != 200) {
                throw new Error("Failed to start scenario");
            }

            const sessionId = resp.data.scenario.id;

            router.replace(`/scenarios/${id}/chat?sessionId=${sessionId}`);

            scenarios.setState((state) => ({
                ...state,
                scenarios: state.scenarios.map((s) =>
                    s.id == id
                        ? {
                              ...s,
                              session_id: sessionId,
                              status: "started",
                          }
                        : s
                ),
            }));
        } catch (e) {
            console.error(e);
            Toast.show({
                type: "error",
                text1: t("errors.something_went_wrong"),
            });
        } finally {
            setLoading(false);
        }
    }, [scenario, id]);

    if (!scenario || !course.currentCourse) {
        return (
            <ThemedView
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ThemedText>{t("errors.something_went_wrong")}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <GestureDismissableModal onDismiss={() => router.back()}>
            <StatusBar style="light" />
            <View
                style={[
                    styles.buttons,
                    {
                        top: insets.top,
                    },
                ]}>
                <NativeTouchable
                    style={{ flex: 1 }}
                    onPress={() => router.back()}>
                    <View style={styles.headerButton}>
                        <ChevronLeft
                            size={24}
                            style={{
                                paddingHorizontal: 24,
                            }}
                            color="white"
                        />
                    </View>
                </NativeTouchable>
                <NativeTouchable
                    style={{ flex: 1 }}
                    onPress={() => router.replace(`/scenarios/${id}/history`)}>
                    <View style={styles.headerButton}>
                        <HistoryIcon
                            size={24}
                            style={{
                                paddingHorizontal: 24,
                            }}
                            color="white"
                        />
                    </View>
                </NativeTouchable>
            </View>
            <ScrollView
                alwaysBounceVertical={false}
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollViewContainer,
                    {
                        paddingBottom: 16 + insets.bottom,
                        backgroundColor: colors.background,
                    },
                ]}>
                <View>
                    <ScenarioPageHeader imageUrl={scenario.imageUrl} />
                    <View
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 16,
                        }}>
                        <FlatList
                            contentContainerStyle={{
                                gap: 8,
                            }}
                            horizontal
                            data={[
                                t(`scenarios.${scenario.type}`),
                                scenario.status == "finished" &&
                                    t("scenarios.filters.finished"),
                                scenario.status == "started" &&
                                    t("scenarios.filters.unfinished"),
                                scenario.status == null &&
                                    t("scenarios.filters.not_started"),
                            ].filter(Boolean)}
                            renderItem={({ item }) => (
                                <Chip
                                    variant="default"
                                    style={{ marginBottom: 8 }}>
                                    <ThemedText style={{ fontSize: 12 }}>
                                        {item}
                                    </ThemedText>
                                </Chip>
                            )}
                        />
                        <ThemedText
                            type="heading"
                            style={{ fontSize: 20, marginBottom: 4 }}>
                            {scenario.title}
                        </ThemedText>
                        <ThemedText type="secondary">
                            {scenario.description}
                        </ThemedText>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button loading={loading} onPress={handleStart}>
                        <ButtonText>
                            {scenario.status == "finished" &&
                                t("scenarios.actions.startNew")}
                            {scenario.status == "started" &&
                                t("scenarios.actions.continue")}
                            {scenario.status == null &&
                                t("scenarios.actions.start")}
                        </ButtonText>
                    </Button>
                </View>
            </ScrollView>
        </GestureDismissableModal>
    );
}

const styles = StyleSheet.create({
    buttons: {
        position: "absolute",
        left: 0,
        zIndex: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    scrollView: {
        position: "relative",
        backgroundColor: "black",
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: "space-between",
    },
    buttonContainer: {
        paddingHorizontal: 16,
    },
    headerButton: {
        paddingVertical: 8,
    },
});
