import StaticBackground from "@/components/ui/StaticBackground";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { ONBOARDING_APPBAR_HEIGHT } from "./OnboardingAppbar";
import { SafeAreaView } from "react-native-safe-area-context";

function Content({
    appbar,
    children,
    safeArea = true,
}: {
    appbar?: boolean;
    children: React.ReactNode;
    safeArea?: boolean;
}) {
    if (safeArea) {
        return (
            <SafeAreaView
                style={[
                    {
                        marginTop: appbar ? ONBOARDING_APPBAR_HEIGHT : 24,
                    },
                    styles.safeArea,
                ]}>
                {children}
            </SafeAreaView>
        );
    }

    return <View style={[styles.wrapper]}>{children}</View>;
}

const styles = StyleSheet.create({
    safeArea: {
        margin: 24,
        marginBottom: 0,
        flex: 1,
        justifyContent: "flex-end",
    },
    wrapper: {
        flex: 1,
    },
});

export default function OnboardingLayout({
    children,
    scrollable = true,
    appbar = false,
    safeArea = true,
}: {
    children: React.ReactNode;
    scrollable?: boolean;
    appbar?: boolean;
    safeArea?: boolean;
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
                    <Content appbar={appbar} safeArea={safeArea}>
                        {children}
                    </Content>
                </ScrollView>
            ) : (
                <Content appbar={appbar} safeArea={safeArea}>
                    {children}
                </Content>
            )}
        </StaticBackground>
    );
}
