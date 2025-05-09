import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { ScrollView, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { router } from "expo-router";
import { SettingsCheckboxItem } from "@/components/settings/SettingsItems";

function Divider() {
    const colors = useThemeColors();

    return (
        <ThemedText
            style={{
                width: "100%",
                height: 1,
                backgroundColor: colors.outline,
                marginVertical: 8,
            }}
        />
    );
}

export default function DeveloperSettings() {
    const colors = useThemeColors();
    const [xp, setXp] = useState(0);
    const [newSection, setNewSection] = useState(false);
    const [updatedStreak, setUpdatedStreak] = useState(false);

    return (
        <ScrollView
            contentContainerStyle={{
                gap: 12,
            }}
            style={{
                backgroundColor: colors.background,
                padding: 16,
            }}>
            <ThemedText>XP: {xp}</ThemedText>
            <Slider
                onValueChange={(v) => {
                    setXp(v);
                }}
                value={xp}
                step={1}
                minimumValue={0}
                maximumValue={10}
            />
            <SettingsCheckboxItem
                title="New section"
                checked={newSection}
                onChange={setNewSection}
            />
            <SettingsCheckboxItem
                title="Updated streak"
                checked={updatedStreak}
                onChange={setUpdatedStreak}
            />
            <Button
                onPress={() => {
                    router.push(
                        `/lessons/success?xp=${xp}&advancedToNextSection=${newSection}&updatedStreak=${updatedStreak}`
                    );
                }}>
                <ButtonText>Task/story success screen</ButtonText>
            </Button>
            <Divider />
            <Button
                onPress={() => {
                    router.push("/scenarios/test/success");
                }}>
                <ButtonText>Scenario success screen</ButtonText>
            </Button>
            <Button
                onPress={() => {
                    router.push("/lessons/streak");
                }}>
                <ButtonText>New streak screen</ButtonText>
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    slider: {
        width: 200,
        height: 40,
    },
});
