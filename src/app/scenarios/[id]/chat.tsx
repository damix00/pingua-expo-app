import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import ScenarioHeader from "@/components/scenarios/ScenarioHeader";
import ScenarioInput from "@/components/scenarios/ScenarioInput";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useScenario } from "@/context/ScenariosContext";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { getPlatformHeaderHeight } from "@/utils/util";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScenarioChatPage(props: any) {
    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const scenario = useScenario(id);
    const kbHeight = useKeyboardHeight(false);

    useEffect(() => {
        if (scenario) {
            navigation.setOptions({
                title: scenario.title,
            });
        }
    }, [scenario?.title]);

    if (!scenario) {
        return (
            <ThemedView style={styles.flexFill}>
                <StatusBar style="auto" />
                <ThemedText>Scenario not found</ThemedText>
                <Button onPress={() => router.back()}>
                    <ButtonText>back</ButtonText>
                </Button>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.flexFill}>
            <StatusBar style="auto" />
            <ScenarioHeader {...scenario} />
            <Animated.FlatList
                inverted
                contentContainerStyle={{
                    paddingBottom: insets.top + getPlatformHeaderHeight(),
                    paddingTop: insets.bottom + 16 + 16 + 96,
                    paddingHorizontal: 16,
                    flexGrow: 1,
                }}
                style={{
                    paddingTop: kbHeight,
                }}
                data={[
                    {
                        text: "Hello",
                    },
                ]}
                keyExtractor={(item) => item.text}
                renderItem={({ item }) => <ThemedText>{item.text}</ThemedText>}
            />
            <ScenarioInput />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    flexFill: {
        flex: 1,
    },
});
