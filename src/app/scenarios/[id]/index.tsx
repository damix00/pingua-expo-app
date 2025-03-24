import { ThemedText } from "@/components/ui/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import {
    FlatList,
    ScrollView,
    TouchableOpacity,
} from "react-native-gesture-handler";
import { useThemeColors } from "@/hooks/useThemeColor";
import GestureDismissableModal from "@/components/modal/GestureDismissableModal";
import { useScenario } from "@/context/ScenariosContext";
import { ThemedView } from "@/components/ThemedView";
import { useTranslation } from "react-i18next";
import { ChevronLeft, HistoryIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Chip from "@/components/ui/chip/Chip";
import { useCallback, useState } from "react";

const blurHash = "LFCaGY%g%hxs0[R.IvRP?Jt7s:t7";

export default function ScenarioScreen() {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const scenario = useScenario(id);
    const insets = useSafeAreaInsets();

    const colors = useThemeColors();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const handleStart = useCallback(async () => {
        router.push(`/scenarios/${id}/chat`);
    }, [scenario, id]);

    if (!scenario) {
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
                    styles.backButton,
                    {
                        top: insets.top + 8,
                    },
                ]}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => router.back()}>
                    <ChevronLeft
                        style={{
                            paddingHorizontal: 24,
                        }}
                        color="white"
                    />
                </TouchableOpacity>
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
                    <View
                        style={[
                            styles.imageContainer,
                            {
                                paddingTop: insets.top / 2,
                                backgroundColor: "black",
                            },
                        ]}>
                        <Image
                            placeholder={{ blurHash }}
                            source={scenario.imageUrl}
                            style={[
                                styles.image,
                                {
                                    height: 200 + insets.top,
                                },
                            ]}
                        />
                        <LinearGradient
                            colors={["transparent", "black"]}
                            style={[
                                styles.gradient,
                                {
                                    top: insets.top / 2 - 1, // Prevents a line from appearing
                                },
                            ]}
                        />
                    </View>
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
    image: {
        width: "100%",
    },
    imageContainer: {
        position: "relative",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "40%",
        transform: [
            {
                rotate: "180deg",
            },
        ],
    },
    backButton: {
        width: 64,
        position: "absolute",
        left: 0,
        zIndex: 10,
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
});
