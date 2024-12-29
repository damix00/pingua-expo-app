import { useAuth } from "@/context/AuthContext";
import { Tabs, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { getJwt, setJwt } from "@/api/data";
import axios from "axios";
import { saveUserCache } from "@/utils/cache/user-cache";
import { useNetworkState } from "expo-network";
import { StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import IosBlurView from "@/components/IosBlurView";

export default function TabLayout() {
    const rootNavigationState = useRootNavigationState();
    const router = useRouter();
    const auth = useAuth();
    const colors = useThemeColors();

    const networkState = useNetworkState();
    const executed = useRef(false);

    const fetchUser = async () => {
        const me = await axios.get("/v1/auth/me");
        const refreshed = await axios.post("/v1/auth/refresh-token");

        if (me.status == 200 && refreshed.status == 200) {
            console.log("User fetched and refreshed");

            setJwt(refreshed.data.jwt);
            auth.setUser(me.data.user);
            await saveUserCache(
                me.data.user,
                refreshed.data.jwt,
                me.data.courses
            );
        }
    };

    useEffect(() => {
        if (networkState.isConnected && auth.loggedIn) {
            fetchUser();
        }
    }, [networkState, auth.loggedIn]);

    useEffect(() => {
        if (executed.current) {
            return;
        }

        // If the navigation isn't mounted yet, don't do anything
        if (!rootNavigationState.key) {
            return;
        }

        const jwt = getJwt();

        executed.current = true;

        if (!auth.loggedIn || !jwt) {
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
                sceneStyle: {
                    backgroundColor: colors.background,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarStyle: {
                    backgroundColor: "transparent",
                    borderTopWidth: 1,
                    borderColor: colors.outline,
                    elevation: 0,
                    position: "absolute",
                },
                // Bottom navigation bar
                tabBarBackground: () => (
                    <IosBlurView
                        intensity={100}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: colors.transparentBackground,
                        }}
                    />
                ),
                tabBarButton: (props) => (
                    // @ts-ignore
                    <TouchableOpacity {...props} activeOpacity={1} />
                ),

                // Header
                headerTransparent: true,
                headerStyle: {
                    backgroundColor: "transparent",
                    elevation: 0,
                    borderBottomWidth: 0,
                },
                headerBackground: () => (
                    <IosBlurView
                        intensity={100}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: colors.transparentBackground,
                            borderBottomWidth: 1,
                            borderColor: colors.outline,
                        }}
                    />
                ),
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
