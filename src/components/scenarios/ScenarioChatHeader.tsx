import { AIScenario, useScenarios } from "@/context/ScenariosContext";
import { getPlatformHeaderHeight } from "@/utils/util";
import { Alert, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/ThemedText";
import IosBlurView from "../IosBlurView";
import { useThemeColors } from "@/hooks/useThemeColor";
import NativeTouchable from "../input/button/NativeTouchable";
import { router } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useCurrentCourse } from "@/hooks/course";

export default function ScenarioChatHeader(props: AIScenario) {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const { t } = useTranslation();
    const course = useCurrentCourse();
    const scenarios = useScenarios();

    return (
        <IosBlurView
            style={[
                {
                    paddingTop: insets.top,
                    borderBottomColor: colors.outline,
                    borderBottomWidth: 1,
                },
                styles.container,
            ]}>
            <View style={styles.containerInner}>
                <View
                    style={{
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                    }}>
                    <NativeTouchable
                        onPress={() =>
                            router.replace(`/scenarios/${props.id}`)
                        }>
                        <View style={{ padding: 8 }}>
                            <ChevronLeft size={24} color={colors.text} />
                        </View>
                    </NativeTouchable>
                    <ThemedText
                        fontWeight="800"
                        numberOfLines={1}
                        style={{
                            flex: 1,
                        }}>
                        {props.title}
                    </ThemedText>
                </View>
                {props.status == "started" && (
                    <NativeTouchable
                        onPress={() => {
                            // Show confirmation alert
                            Alert.alert(
                                t("scenarios.newScenarioAlert.title"),
                                t("scenarios.newScenarioAlert.description"),
                                [
                                    {
                                        text: t("no"),
                                        style: "cancel",
                                    },
                                    {
                                        text: t("yes"),
                                        style: "destructive",
                                        onPress: async () => {
                                            const resp = await axios.post(
                                                `/v1/courses/${
                                                    course.currentCourse!.id
                                                }/scenarios/${props.id}`
                                            );

                                            if (resp.status != 200) {
                                                throw new Error(
                                                    "Failed to start scenario"
                                                );
                                            }

                                            const sessionId =
                                                resp.data.scenario.id;

                                            router.replace(
                                                `/scenarios/${props.id}/chat?sessionId=${sessionId}`
                                            );

                                            scenarios.setState((state) => ({
                                                ...state,
                                                scenarios: state.scenarios.map(
                                                    (s) =>
                                                        s.id == props.id
                                                            ? {
                                                                  ...s,
                                                                  session_id:
                                                                      sessionId,
                                                                  status: "started",
                                                              }
                                                            : s
                                                ),
                                            }));
                                        },
                                    },
                                ]
                            );
                        }}>
                        <View style={{ padding: 8 }}>
                            <Plus size={24} color={colors.text} />
                        </View>
                    </NativeTouchable>
                )}
            </View>
        </IosBlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        zIndex: 10,
    },
    containerInner: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: getPlatformHeaderHeight(),
        flex: 1,
    },
});
