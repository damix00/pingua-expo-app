import StaticBackground from "@/components/ui/StaticBackground";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { ONBOARDING_APPBAR_HEIGHT } from "./OnboardingAppbar";
import { SafeAreaView } from "react-native-safe-area-context";

function Content({
    appbar,
    children,
}: {
    appbar?: boolean;
    children: React.ReactNode;
}) {
    return (
        <SafeAreaView
            style={{
                margin: 24,
                marginTop: appbar ? ONBOARDING_APPBAR_HEIGHT : 24,
                marginBottom: 0,
                flex: 1,
                justifyContent: "flex-end",
            }}>
            {children}
        </SafeAreaView>
    );
}

export default function OnboardingLayout({
    children,
    scrollable = true,
    appbar = false,
}: {
    children: React.ReactNode;
    scrollable?: boolean;
    appbar?: boolean;
}) {
    return (
        <StaticBackground>
            <StatusBar style="light" />
            {scrollable ? (
                <ScrollView
                    style={{
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}>
                    <Content appbar={appbar}>{children}</Content>
                </ScrollView>
            ) : (
                <Content appbar={appbar}>{children}</Content>
            )}
        </StaticBackground>
    );
}
