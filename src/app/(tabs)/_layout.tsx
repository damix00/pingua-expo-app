import { Course, useAuth } from "@/context/AuthContext";
import { Tabs, useRootNavigationState, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/hooks/useThemeColor";
import { getJwt, setJwt } from "@/api/data";
import axios from "axios";
import { clearUserCache, saveUserCache } from "@/utils/cache/user-cache";
import { useNetworkState } from "expo-network";
import { StyleSheet, TouchableOpacity } from "react-native";
import IosBlurView from "@/components/IosBlurView";
import { usePopAllAndPush } from "@/hooks/navigation";
import { useTranslation } from "react-i18next";
import CourseSelect from "@/components/homescreen/home/CourseSelect";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import CourseSelectSheet from "@/components/homescreen/home/CourseSelectSheet";
import PremiumButton from "@/components/homescreen/home/PremiumButton";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { useChats } from "@/context/ChatContext";
import { scheduleReminderNotifications } from "@/utils/notifications";

export default function TabLayout() {
    const bottomSheet = useBottomSheet();
    const router = useRouter();
    const auth = useAuth();
    const colors = useThemeColors();
    const popAllAndPush = usePopAllAndPush();
    const { t, i18n } = useTranslation();
    const appChats = useChats();

    const networkState = useNetworkState();
    const executed = useRef(false);

    const scheduledNotifications = useRef(false);

    const handlePresentModalPress = useCallback(() => {
        bottomSheet.setBottomSheet(<CourseSelectSheet />);
    }, []);

    const fetchUser = async () => {
        const me = await axios.get("/v1/auth/me");
        const refreshed = await axios.post("/v1/auth/refresh-token");
        const chats = await axios.get("/v1/chats");

        if (me.status == 200 && refreshed.status == 200) {
            setJwt(refreshed.data.jwt);
            auth.setUser(me.data.user);
            auth.setCourses(me.data.courses);
            auth.setSectionData(me.data.section_data);
            auth.setSectionCount(me.data.section_count);

            const selectedCourse = me.data.courses[0];

            if (chats.status == 200) {
                appChats.setChats(chats.data.chats);
            }

            await saveUserCache({
                user: me.data.user,
                jwt: refreshed.data.jwt,
                courses: me.data.courses,
                sectionData: me.data.section_data,
                selectedCourse: selectedCourse.id,
                chats: chats.data?.chats ?? [],
                sectionCount: me.data.section_count,
            });

            if (!scheduledNotifications.current) {
                scheduledNotifications.current = true;

                await scheduleReminderNotifications();
            }
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

        const jwt = getJwt();

        executed.current = true;

        // Have to use setTimeout because in the newest version of Expo the useRootNavigationState causes an infinite loop

        if (!auth.loggedIn || !jwt) {
            setTimeout(() => {
                router.replace("/onboarding");
            }, 100);
        }

        if (auth.loggedIn && auth.user?.plan == "FREE") {
            setTimeout(() => {
                router.push("/modals/subscription");
            }, 100);
        }
    }, [auth]);

    if (!auth.loggedIn) {
        return null;
    }

    return (
        <BottomSheetModalProvider>
            <Tabs
                screenOptions={{
                    freezeOnBlur: true,
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
                    headerTitleStyle: {
                        color: colors.text,
                        fontFamily: "Montserrat_600SemiBold",
                    },
                    headerLeft: () => (
                        <CourseSelect onPress={handlePresentModalPress} />
                    ),
                    headerRight: () => <PremiumButton />,
                    // Bottom navigation bar
                    tabBarBackground: () => (
                        <IosBlurView
                            intensity={50}
                            style={{
                                ...StyleSheet.absoluteFillObject,
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
                    tabBarInactiveTintColor: colors.textSecondary,
                    headerBackground: () => (
                        <IosBlurView
                            intensity={50}
                            style={{
                                ...StyleSheet.absoluteFillObject,
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
                    name="scenarios"
                    options={{
                        title: t("tabs.scenarios"),
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
                    name="translate"
                    options={{
                        title: t("tabs.translate"),
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "language" : "language-outline"}
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
        </BottomSheetModalProvider>
    );
}
