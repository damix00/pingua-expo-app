import { useAuth } from "@/context/AuthContext";
import { Tabs, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function TabLayout() {
    const rootNavigationState = useRootNavigationState();
    const router = useRouter();
    const auth = useAuth();
    const colors = useThemeColors();

    const executed = useRef(false);

    useEffect(() => {
        if (executed.current) {
            return;
        }

        // If the navigation isn't mounted yet, don't do anything
        if (!rootNavigationState.key) {
            return;
        }

        executed.current = true;

        if (!auth.loggedIn) {
            router.replace("/onboarding");
        }

        if (auth.loggedIn && auth.user?.plan == "FREE") {
            router.push("/modals/subscription");
        }
    }, [auth, rootNavigationState]);

    if (!auth.loggedIn) {
        return null;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                headerTransparent: true,
                tabBarStyle: {
                    backgroundColor: "transparent",
                    borderTopWidth: 0,
                    elevation: 0,
                    position: "absolute",
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={24}
                            color={
                                focused ? colors.primary : colors.textSecondary
                            }
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={24}
                            color={
                                focused ? colors.primary : colors.textSecondary
                            }
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
