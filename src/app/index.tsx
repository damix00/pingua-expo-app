import { ExternalLink, LinkText } from "@/components/ExternalLink";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, useColorScheme, View } from "react-native";

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
            <ExternalLink href="https://docs.expo.dev">
                <LinkText>Learn more</LinkText>
            </ExternalLink>
        </ThemedView>
    );
}
