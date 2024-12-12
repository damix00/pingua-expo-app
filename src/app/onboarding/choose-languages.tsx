import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedText } from "@/components/ui/ThemedText";
import { Link } from "expo-router";
import { View } from "react-native";
import OnboardingLayout from "./OnboardingLayout";

export default function ChooseLanguageOnboarding() {
    return (
        <OnboardingLayout>
            <View
                style={{
                    flex: 1,
                }}>
                <ThemedText>hello!</ThemedText>
            </View>
        </OnboardingLayout>
    );
}
