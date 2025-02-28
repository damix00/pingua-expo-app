import { ThemedText } from "@/components/ui/ThemedText";
import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyPolicyModal() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 24,
                gap: 8,
                flexDirection: "column",
                paddingBottom: insets.bottom + 128,
            }}>
            <ThemedText type="title">Privacy Policy</ThemedText>
            <ThemedText>
                Your privacy is important to us. This Privacy Policy explains
                how we collect, use, and protect your information.
            </ThemedText>
            <ThemedText type="heading">1. Information We Collect</ThemedText>
            <ThemedText>
                We collect information you provide directly, such as account
                details, and automatically, such as usage data.
            </ThemedText>
            <ThemedText type="heading">
                2. How We Use Your Information
            </ThemedText>
            <ThemedText>
                We use your information to provide and improve Pingua,
                personalize experiences, and ensure security.
            </ThemedText>
            <ThemedText type="heading">3. Sharing Your Information</ThemedText>
            <ThemedText>
                We do not sell your personal data. We may share it with trusted
                partners for necessary services, legal compliance, or protection
                of rights.
            </ThemedText>
            <ThemedText type="heading">4. Data Security</ThemedText>
            <ThemedText>
                We implement security measures to protect your data, but no
                method is 100% secure.
            </ThemedText>
            <ThemedText type="heading">5. Your Rights</ThemedText>
            <ThemedText>
                You have rights regarding your personal data, including access,
                correction, and deletion requests.
            </ThemedText>
            <ThemedText type="heading">6. Changes to This Policy</ThemedText>
            <ThemedText>
                We may update this Privacy Policy. Continued use of Pingua after
                changes means you accept the updated policy.
            </ThemedText>
            <ThemedText type="heading">7. Contact Us</ThemedText>
            <ThemedText>
                If you have any questions about this Privacy Policy, please
                contact us at support@latinary.com.
            </ThemedText>
        </ScrollView>
    );
}
