import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { clearUserCache } from "@/utils/cache/user-cache";
import { ScrollView } from "react-native";

export default function Index() {
    const auth = useAuth();
    const colors = useThemeColors();

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
                paddingHorizontal: 24,
                backgroundColor: colors.background,
            }}>
            <ThemedText>Hi, {auth.user?.name}!</ThemedText>
            <Button
                onPress={async () => {
                    await clearUserCache();
                    auth.logout();
                }}>
                <ButtonText>Logout</ButtonText>
            </Button>
            <Button href="/modals/subscription">
                <ButtonText>Subscribe</ButtonText>
            </Button>
        </ScrollView>
    );
}
