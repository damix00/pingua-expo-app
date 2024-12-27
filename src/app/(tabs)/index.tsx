import { ExternalLink, LinkText } from "@/components/ExternalLink";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { clearUserCache } from "@/utils/cache/user-cache";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
    const auth = useAuth();

    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <ThemedText>Hi, {auth.user?.name}!</ThemedText>
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
