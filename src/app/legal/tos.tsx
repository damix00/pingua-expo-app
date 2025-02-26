import { ThemedText } from "@/components/ui/ThemedText";
import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TOSModal() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 24,
                gap: 8,
                flexDirection: "column",
                paddingBottom: insets.bottom + 128,
            }}>
            <ThemedText type="title">Terms of Service</ThemedText>
            <ThemedText>
                Welcome to Pingua! By using our app, you agree to the following
                terms and conditions.
            </ThemedText>
            <ThemedText type="heading">1. Acceptance of Terms</ThemedText>
            <ThemedText>
                By accessing or using Pingua, you agree to be bound by these
                Terms of Service. If you do not agree, do not use the app.
            </ThemedText>
            <ThemedText type="heading">2. User Accounts</ThemedText>
            <ThemedText>
                You may need to create an account to access certain features.
                You are responsible for maintaining the security of your
                account.
            </ThemedText>
            <ThemedText type="heading">3. Acceptable Use</ThemedText>
            <ThemedText>
                You agree not to misuse the app, including engaging in any
                illegal activities, harassing other users, or attempting to
                disrupt the service.
            </ThemedText>
            <ThemedText type="heading">4. Content Ownership</ThemedText>
            <ThemedText>
                Any content you create remains yours, but by using Pingua, you
                grant us a license to use it for improving the service.
            </ThemedText>
            <ThemedText type="heading">5. Termination</ThemedText>
            <ThemedText>
                We reserve the right to suspend or terminate your account if you
                violate these terms.
            </ThemedText>
            <ThemedText type="heading">6. Changes to Terms</ThemedText>
            <ThemedText>
                We may update these terms from time to time. Continued use of
                Pingua after changes means you accept the updated terms.
            </ThemedText>
            <ThemedText type="heading">7. Contact Us</ThemedText>
            <ThemedText>
                If you have any questions about these terms, please contact us
                at support@pingua.com.
            </ThemedText>
        </ScrollView>
    );
}
