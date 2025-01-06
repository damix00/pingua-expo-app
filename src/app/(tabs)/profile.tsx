import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { usePopAllAndPush } from "@/hooks/navigation";
import { clearUserCache } from "@/utils/cache/user-cache";

export default function ProfileTab() {
    const popAllAndPush = usePopAllAndPush();
    const auth = useAuth();

    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
                padding: 24,
            }}>
            <ThemedText>Profile</ThemedText>
            <Button
                onPress={async () => {
                    await clearUserCache();
                    auth.logout();
                    popAllAndPush("onboarding/index");
                }}>
                <ButtonText>Logout</ButtonText>
            </Button>
            <Button href="/modals/subscription">
                <ButtonText>Subscribe</ButtonText>
            </Button>
        </ThemedView>
    );
}
