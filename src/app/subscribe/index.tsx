import { ThemedView } from "@/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function SubscribePage() {
    const insets = useSafeAreaInsets();
    const { url } = useLocalSearchParams();
    const ref = useRef<WebView>(null);

    if (!url) {
        return null;
    }

    return (
        <ThemedView
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                flex: 1,
            }}>
            <WebView
                ref={ref}
                source={{ uri: url as string }}
                style={{ flex: 1 }}
                onNavigationStateChange={(event) => {
                    const url = event.url;

                    if (!url) return;

                    if (url.includes("success")) {
                        ref.current?.stopLoading();
                        router.replace("/subscribe/success");
                    } else if (url.includes("cancel")) {
                        ref.current?.stopLoading();
                        router.back();
                    }
                }}
            />
        </ThemedView>
    );
}
