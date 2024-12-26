import { ExternalLink, LinkText } from "@/components/ExternalLink";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { clearUserCache } from "@/utils/cache/user-cache";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
    const rootNavigationState = useRootNavigationState();
    const router = useRouter();
    const auth = useAuth();

    useEffect(() => {
        // If the navigation isn't mounted yet, don't do anything
        if (!rootNavigationState.key) {
            return;
        }

        if (!auth.loggedIn) {
            router.replace("/onboarding");
        }
    }, [auth, rootNavigationState]);

    if (!auth.loggedIn) {
        return null;
    }

    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Button
                onPress={async () => {
                    await clearUserCache();
                    auth.logout();
                }}>
                <ButtonText>Logout</ButtonText>
            </Button>
        </ThemedView>
    );
}
