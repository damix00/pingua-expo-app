import { AuthProvider } from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, useColorScheme, View } from "react-native";
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
    WorkSans_100Thin,
    WorkSans_200ExtraLight,
    WorkSans_300Light,
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    WorkSans_800ExtraBold,
    WorkSans_900Black,
} from "@expo-google-fonts/work-sans";
import {
    loadPreferences,
    PreferencesProvider,
    PreferencesType,
} from "@/context/PreferencesContext";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import OnboardingAppbar from "./onboarding/OnboardingAppbar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loadedFonts] = useFonts({
        // Montserrat - body font
        Montserrat_100Thin,
        Montserrat_200ExtraLight,
        Montserrat_300Light,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_800ExtraBold,
        Montserrat_900Black,
        // Work Sans - brand font
        WorkSans_100Thin,
        WorkSans_200ExtraLight,
        WorkSans_300Light,
        WorkSans_400Regular,
        WorkSans_500Medium,
        WorkSans_600SemiBold,
        WorkSans_700Bold,
        WorkSans_800ExtraBold,
        WorkSans_900Black,
    });

    const [loggedIn, setLoggedIn] = useState(false);
    const [loadedPrefs, setLoadedPrefs] = useState(false);
    const [loadedAll, setLoadedAll] = useState(false);
    const [prefs, setPrefs] = useState<PreferencesType | null>(null);
    const scheme = useColorScheme();
    const colors = useThemeColors();

    const loading = useRef(false);

    const load = async () => {
        setPrefs(await loadPreferences());
        setLoadedPrefs(true);

        console.log("Loaded preferences");

        if (Platform.OS === "android") {
            await NavigationBar.setPositionAsync("absolute");
            await NavigationBar.setBackgroundColorAsync("#ffffff00");
        }
    };

    useEffect(() => {
        if (loadedFonts && loadedPrefs && !loadedAll) {
            console.log("Loaded all assets");
            setLoadedAll(true);
            SplashScreen.hideAsync();
        }
    }, [loadedFonts, loadedPrefs]);

    useEffect(() => {
        if (!loading.current) {
            load();
            loading.current = true;
        }
    }, []);

    if (!loadedAll) {
        return null;
    }

    return (
        <PreferencesProvider
            preferences={prefs ?? { hapticFeedback: true }}
            setPreferences={() => {}}>
            <AuthProvider
                user={null}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}>
                <ThemeProvider
                    value={scheme === "dark" ? DarkTheme : DefaultTheme}>
                    <StatusBar style="auto" />

                    <Stack
                        initialRouteName={
                            loggedIn ? "index" : "onboarding/index"
                        }
                        screenOptions={{
                            headerStyle: Platform.select({
                                android: {},
                            }),
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
                                header: () => (
                                    <OnboardingAppbar title="Choose Languages" />
                                ),
                                animation: "default",
                            }}
                        />
                        <Stack.Screen
                            name="auth/index"
                            options={{
                                headerShown: false,
                                animation: "default",
                            }}
                        />
                        <Stack.Screen name="index" />
                    </Stack>
                </ThemeProvider>
            </AuthProvider>
        </PreferencesProvider>
    );
}
