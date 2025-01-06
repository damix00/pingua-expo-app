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
import { SplashScreen, Stack, useNavigation, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, useColorScheme, View } from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadUserCache, UserCacheType } from "@/utils/cache/user-cache";
import { setJwt } from "@/api/data";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Disable auto-hide and manage it manually
SplashScreen.preventAutoHideAsync();

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

    // Store preferences and user data
    const [prefs, setPrefs] = useState<PreferencesType | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [sectionData, setSectionData] = useState<SectionData[]>([]);

    const scheme = useColorScheme();
    const colors = useThemeColors();
    const pathname = usePathname();

    // Prevent multiple loading attempts
    const loading = useRef(false);

    // Async loading routine for preferences, locales, user data
    const load = async () => {
        initAxios();
        setPrefs(await loadPreferences());
        setLoadedPrefs(true);
        await loadLocales();

        // Fetch user data and set JWT if available
        const userCache = await loadUserCache();
        setUser(userCache.user);
        if (userCache.jwt) {
            setLoggedIn(true);
        }
        setJwt(userCache.jwt ?? "");
        setCourses(userCache.courses);
        setSelectedCourse(userCache.selectedCourse);
        setSectionData(userCache.sectionData);

        // Adjust navigation bar for Android
        if (Platform.OS === "android") {
            await NavigationBar.setPositionAsync("absolute");
            await NavigationBar.setBackgroundColorAsync("#ffffff00");
        }
    };

    // Hide splash once fonts and preferences load
    useEffect(() => {
        if (loadedFonts && loadedPrefs && !loadedAll) {
            setLoadedAll(true);
            SplashScreen.hideAsync();
        }
    }, [loadedFonts, loadedPrefs]);

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
        <GestureHandlerRootView>
            <View
                style={{
                    flex: 1,
                    backgroundColor: pathname.startsWith("/onboarding")
                        ? colors.primary
                        : colors.background,
                }}>
                <PreferencesProvider
                    preferences={prefs ?? { hapticFeedback: true }}
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
                        setLoggedIn={setLoggedIn}>
                        <ThemeProvider
                            value={
                                scheme === "dark" ? DarkTheme : DefaultTheme
                            }>
                            <StatusBar style="auto" />

                            {/* Stack for handling navigation between screens */}
                            <Stack
                                initialRouteName={
                                    loggedIn ? "(tabs)" : "onboarding/index"
                                }
                                screenOptions={{
                                    animation: Platform.select({
                                        android: "simple_push",
                                        ios: "ios_from_right",
                                    }),
                                }}>
                                <Stack.Screen
                                    name="onboarding/index"
                                    options={{
                                        animation: "none",
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="onboarding/choose-languages"
                                    options={{
                                        headerShown: true,
                                        headerTransparent: true,
                                        header: () => <OnboardingAppbar />,
                                    }}
                                />
                                <Stack.Screen
                                    name="onboarding/app-language"
                                    options={{
                                        headerShown: true,
                                        headerTransparent: true,
                                        header: () => <OnboardingAppbar />,
                                    }}
                                />
                                <Stack.Screen
                                    name="onboarding/choose-fluency"
                                    options={{
                                        headerShown: true,
                                        headerTransparent: true,
                                        header: () => <OnboardingAppbar />,
                                    }}
                                />
                                <Stack.Screen
                                    name="onboarding/configuring-course"
                                    options={{
                                        headerShown: false,
                                        gestureEnabled: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="onboarding/choose-goal"
                                    options={{
                                        headerShown: true,
                                        headerTransparent: true,
                                        header: () => <OnboardingAppbar />,
                                    }}
                                />
                                <Stack.Screen
                                    name="onboarding/no-account"
                                    options={{
                                        headerShown: true,
                                        headerTransparent: true,
                                        header: () => <OnboardingAppbar />,
                                    }}
                                />
                                <Stack.Screen
                                    name="auth/index"
                                    options={{
                                        headerShown: true,
                                        headerTransparent: true,
                                        header: () => (
                                            <OnboardingAppbar darkText />
                                        ),
                                    }}
                                />
                                <Stack.Screen
                                    name="auth/otp"
                                    options={{
                                        headerShown: true,
                                        headerTransparent: true,
                                        header: () => (
                                            <OnboardingAppbar darkText />
                                        ),
                                    }}
                                />
                                <Stack.Screen
                                    name="auth/profile-setup"
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{ headerShown: false }}
                                />

                                {/* Modals */}
                                <Stack.Screen
                                    name="modals/subscription"
                                    options={{
                                        gestureEnabled: false,
                                        presentation: "modal",
                                        headerShown: false,
                                        animation:
                                            Platform.OS == "android"
                                                ? "slide_from_bottom"
                                                : "default",
                                    }}
                                />
                            </Stack>
                        </ThemeProvider>
                    </AuthProvider>
                </PreferencesProvider>

                {/* Toast notifications */}
                <Toast
                    config={{
                        success: BaseToast,
                        error: (props) => <BaseToast error {...props} />,
                        info: BaseToast,
                        any_custom_type: BaseToast,
                    }}
                    topOffset={0}
                    bottomOffset={0}
                />
            </View>
        </GestureHandlerRootView>
    );
}
