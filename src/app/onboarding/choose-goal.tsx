import BrandText from "@/components/ui/BrandText";
import OnboardingLayout from "./OnboardingLayout";
import { ThemedText } from "@/components/ui/ThemedText";
import { StyleSheet, View } from "react-native";

export default function ChooseGoalOnboarding() {
    return (
        <OnboardingLayout appbar>
            <View style={styles.parent}>
                <BrandText
                    onPrimary
                    large
                    style={[{ paddingBottom: 4, fontSize: 28 }]}>
                    How commited are you?
                </BrandText>
                <ThemedText type="onPrimarySecondary">
                    Choose how much time you will spend learning on the app.
                </ThemedText>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        justifyContent: "flex-start",
    },
});
