import { useAuth } from "@/context/AuthContext";
import { Tabs, useRootNavigationState, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { getJwt, setJwt } from "@/api/data";
import axios from "axios";
import { clearUserCache, saveUserCache } from "@/utils/cache/user-cache";
import { useNetworkState } from "expo-network";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import IosBlurView from "@/components/IosBlurView";
import { usePopAllAndPush } from "@/hooks/navigation";
import { useTranslation } from "react-i18next";
import CourseSelect from "@/components/homescreen/CourseSelect";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ThemedText } from "@/components/ui/ThemedText";
import CourseSelectSheet from "@/components/homescreen/CourseSelectSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PremiumButton from "@/components/homescreen/PremiumButton";

export default function TabLayout() {
    const rootNavigationState = useRootNavigationState();
    const router = useRouter();
    const auth = useAuth();
    const colors = useThemeColors();
    const popAllAndPush = usePopAllAndPush();
    const { t } = useTranslation();
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

    const networkState = useNetworkState();
    const executed = useRef(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handlePresentModalPress = useCallback(() => {
        setBottomSheetVisible(true);

        bottomSheetModalRef.current?.present();
    }, []);

    const fetchUser = async () => {
        const me = await axios.get("/v1/auth/me");
        const refreshed = await axios.post("/v1/auth/refresh-token");

        console.log(me.data.section_data);

        if (me.status == 200 && refreshed.status == 200) {
            setJwt(refreshed.data.jwt);
            auth.setUser(me.data.user);
            auth.setSectionData(me.data.section_data);
            await saveUserCache(
                me.data.user,
                refreshed.data.jwt,
                me.data.section_data,
                me.data.courses
            );
        } else if (me.status == 401) {
            await clearUserCache();
            auth.logout();
            popAllAndPush("onboarding/index");
        }
    };

    useEffect(() => {
        if (networkState.isConnected && auth.loggedIn) {
            fetchUser();
        }
    }, [networkState.isConnected, auth.loggedIn]);

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
        <BottomSheetModalProvider>
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
                    headerLeft: () => (
                        <CourseSelect onPress={handlePresentModalPress} />
                    ),
                    headerRight: () => <PremiumButton />,
                    // Bottom navigation bar
                    tabBarBackground: () => (
                        <IosBlurView
                            intensity={48}
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor:
                                    Platform.OS == "ios"
                                        ? colors.transparentBackground
                                        : colors.background,
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
                            intensity={48}
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor:
                                    Platform.OS == "ios"
                                        ? colors.transparentBackground
                                        : colors.background,
                                borderBottomWidth: 1,
                                borderColor: colors.outline,
                            }}
                        />
                    ),
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: t("tabs.home"),
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={24}
                                color={
                                    focused
                                        ? colors.primary
                                        : colors.textSecondary
                                }
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="overview"
                    options={{
                        title: t("tabs.overview"),
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "sparkles" : "sparkles-outline"}
                                size={24}
                                color={
                                    focused
                                        ? colors.primary
                                        : colors.textSecondary
                                }
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="chats"
                    options={{
                        title: t("tabs.chats"),
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={
                                    focused
                                        ? "chatbubbles"
                                        : "chatbubbles-outline"
                                }
                                size={24}
                                color={
                                    focused
                                        ? colors.primary
                                        : colors.textSecondary
                                }
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: t("tabs.profile"),
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "person" : "person-outline"}
                                size={24}
                                color={
                                    focused
                                        ? colors.primary
                                        : colors.textSecondary
                                }
                            />
                        ),
                    }}
                />
            </Tabs>
            <BottomSheetModal
                backgroundStyle={{
                    backgroundColor: colors.background,
                }}
                containerStyle={{
                    backgroundColor: "#00000039",
                }}
                onDismiss={() => setBottomSheetVisible(false)}
                ref={bottomSheetModalRef}>
                <CourseSelectSheet />
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
}
