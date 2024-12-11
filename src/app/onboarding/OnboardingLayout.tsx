import StaticBackground from "@/components/ui/StaticBackground";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StaticBackground>
            <SafeAreaView
                style={{
                    margin: 24,
                    marginBottom: 0,
                    flex: 1,
                    justifyContent: "flex-end",
                }}>
                <StatusBar style="light" />
                {children}
            </SafeAreaView>
        </StaticBackground>
    );
}
