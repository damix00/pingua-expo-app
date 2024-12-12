import StaticBackground from "@/components/ui/StaticBackground";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Content({ children }: { children: React.ReactNode }) {
    return (
        <SafeAreaView
            style={{
                margin: 24,
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
}: {
    children: React.ReactNode;
    scrollable?: boolean;
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
                    <Content>{children}</Content>
                </ScrollView>
            ) : (
                <Content>{children}</Content>
            )}
        </StaticBackground>
    );
}
