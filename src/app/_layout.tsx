// Provide authentication, preferences, theming, and app navigation setup
import {
    AuthProvider,
    AuthUser,
    Course,
    SectionData,
} from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Appearance,
    Platform,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native";
// Font imports
import {
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import {
    Comfortaa_300Light,
    Comfortaa_400Regular,
    Comfortaa_500Medium,
    Comfortaa_600SemiBold,
    Comfortaa_700Bold,
} from "@expo-google-fonts/comfortaa";
import {
    loadPreferences,
    PreferencesProvider,
    PreferencesType,
} from "@/context/PreferencesContext";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import OnboardingAppbar from "./onboarding/OnboardingAppbar";
import loadLocales from "../utils/i18n";
import { initAxios } from "@/api/config";
import Toast from "react-native-toast-message";
import BaseToast from "@/components/ui/toast/BaseToast";
import { loadUserCache } from "@/utils/cache/user-cache";
import { setJwt } from "@/api/data";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalBottomSheetProvider } from "@/context/BottomSheetContext";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "@/components/modal/BottomSheet";
import { Chat, ChatProvider } from "@/context/ChatContext";
import ChatHeader from "@/components/homescreen/chats/ChatHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { requestNotificationsAsync } from "@/utils/permissions";
import { cancelReminderNotifications } from "@/utils/notifications";
import IosBlurView from "@/components/IosBlurView";
import AppRouter from "@/components/AppRouter";
import { ScenariosProvider } from "@/context/ScenariosContext";

// Disable auto-hide and manage it manually
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function RootLayout() {
    // Load custom fonts
    const [loadedFonts] = useFonts({
        Montserrat_100Thin,
        Montserrat_200ExtraLight,
        Montserrat_300Light,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_800ExtraBold,
        Montserrat_900Black,
        Comfortaa_300Light,
        Comfortaa_400Regular,
        Comfortaa_500Medium,
        Comfortaa_600SemiBold,
        Comfortaa_700Bold,
    });

    // Track authentication state
    const [loggedIn, setLoggedIn] = useState(false);

    // Track if preferences and other assets are loaded
    const [loadedPrefs, setLoadedPrefs] = useState(false);
    const [loadedAll, setLoadedAll] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // Store preferences and user data
    const [prefs, setPrefs] = useState<PreferencesType | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [sectionData, setSectionData] = useState<SectionData[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [sectionCount, setSectionCount] = useState(1);

    const scheme = useColorScheme();
    const colors = useThemeColors();
    const pathname = usePathname();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [bottomSheetComponent, setBottomSheetComponent] =
        useState<React.ReactNode | null>(null);

    const prevComponent = useRef<React.ReactNode | null>(null);

    const theme = useMemo(
        () =>
            prefs?.darkMode == "system"
                ? scheme ?? "light"
                : prefs?.darkMode == "true"
                ? "dark"
                : "light",
        [prefs, scheme]
    );

    useEffect(() => {
        Appearance.setColorScheme(
            prefs?.darkMode == "system"
                ? null
                : prefs?.darkMode == "true"
                ? "dark"
                : "light"
        );
    }, [prefs]);

    const transparentHeader = useMemo(
        () => ({
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                borderBottomWidth: 0,
            },
            headerTransparent: true,
            headerBackground: () => (
                <IosBlurView
                    intensity={36}
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        borderBottomWidth: 1,
                        borderColor: colors.outline,
                    }}
                />
            ),
        }),
        [colors]
    );

    useEffect(() => {
        if (
            bottomSheetComponent &&
            prevComponent.current !== bottomSheetComponent
        ) {
            bottomSheetRef.current?.present();
        }

        prevComponent.current = bottomSheetComponent;
    }, [bottomSheetComponent]);

    const showBottomSheet = useCallback(() => {
        bottomSheetRef.current?.present();
    }, [bottomSheetComponent, bottomSheetRef]);

    // Prevent multiple loading attempts
    const loading = useRef(false);

    // Async loading routine for preferences, locales, user data
    const load = useCallback(async () => {
        initAxios();
        setPrefs(await loadPreferences());
        setLoadedPrefs(true);
        await loadLocales();

        await requestNotificationsAsync();

        await Notifications.dismissAllNotificationsAsync();
        await cancelReminderNotifications();

        // Fetch user data and set JWT if available
        const userCache = await loadUserCache();

        setUser(userCache.user);

        if (userCache.jwt) {
            setLoggedIn(true);
        }

        setJwt(userCache.jwt ?? "");
        setCourses(userCache.courses);
        setSelectedCourse(userCache.selectedCourse);
        setChats(userCache.chats);
        setSectionCount(userCache.sectionCount);

        setSectionData(userCache.sectionData);

        setInitialized(true);
    }, []);

    useEffect(() => {
        (async () => {
            // Adjust navigation bar for Android
            if (Platform.OS === "android") {
                await NavigationBar.setPositionAsync("absolute");
                await NavigationBar.setBackgroundColorAsync(colors.background);
                await NavigationBar.setButtonStyleAsync(
                    theme == "light" ? "dark" : "light"
                );
            }
        })();
    }, [colors, theme]);

    // Hide splash once fonts and preferences load
    useEffect(() => {
        if (loadedFonts && loadedPrefs && !loadedAll && initialized) {
            setLoadedAll(true);
            SplashScreen.hideAsync();
        }
    }, [loadedFonts, loadedPrefs, initialized]);

    // Initiate loading on component mount
    useEffect(() => {
        if (!loading.current) {
            load();
            loading.current = true;
        }
    }, []);

    // Render nothing until everything is ready
    if (!loadedAll) {
        return null;
    }

    // Provide preferences, authentication, and theme to the rest of the app
    return (
        <GlobalBottomSheetProvider
            setBottomSheet={setBottomSheetComponent}
            showBottomSheet={showBottomSheet}
            hideBottomSheet={() => {
                bottomSheetRef.current?.dismiss();
            }}>
            <GestureHandlerRootView>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: pathname.startsWith("/onboarding")
                            ? colors.primary
                            : colors.background,
                    }}>
                    <PreferencesProvider
                        preferences={
                            prefs ?? {
                                hapticFeedback: true,
                                darkMode: "system",
                            }
                        }
                        setPreferences={(newPrefs) => setPrefs(newPrefs)}>
                        <AuthProvider
                            sectionData={sectionData}
                            setSectionData={setSectionData}
                            selectedCourse={selectedCourse}
                            setSelectedCourse={setSelectedCourse}
                            courses={courses}
                            user={user}
                            setUser={setUser}
                            setCourses={setCourses}
                            loggedIn={loggedIn}
                            sectionCount={sectionCount}
                            setSectionCount={setSectionCount}
                            setLoggedIn={setLoggedIn}>
                            <ChatProvider chats={chats} setChats={setChats}>
                                <ThemeProvider
                                    value={
                                        theme === "dark"
                                            ? DarkTheme
                                            : DefaultTheme
                                    }>
                                    <ScenariosProvider>
                                        <BottomSheetModalProvider>
                                            <StatusBar style="auto" />

                                            {/* Stack for handling navigation between screens */}
                                            <AppRouter loggedIn={loggedIn} />

                                            <CustomBottomSheetModal
                                                ref={bottomSheetRef}>
                                                {bottomSheetComponent}
                                            </CustomBottomSheetModal>

                                            {/* Toast notifications */}
                                            <Toast
                                                config={{
                                                    success: BaseToast,
                                                    error: (props) => (
                                                        <BaseToast
                                                            error
                                                            {...props}
                                                        />
                                                    ),
                                                    info: BaseToast,
                                                    any_custom_type: BaseToast,
                                                }}
                                                topOffset={0}
                                                bottomOffset={0}
                                            />
                                        </BottomSheetModalProvider>
                                    </ScenariosProvider>
                                </ThemeProvider>
                            </ChatProvider>
                        </AuthProvider>
                    </PreferencesProvider>
                </View>
            </GestureHandlerRootView>
        </GlobalBottomSheetProvider>
    );
}
