import { AuthProvider } from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, useColorScheme } from "react-native";
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
    const scheme = useColorScheme();
    const colors = useThemeColors();

    const loaded = loadedFonts;

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loadedFonts]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider user={null} loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
            <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack
                    initialRouteName={loggedIn ? "index" : "onboarding/index"}
                    screenOptions={{
                        headerStyle: Platform.select({
                            android: {},
                        }),
                    }}>
                    <Stack.Screen
                        name="onboarding/index"
                        options={{ animation: "none", headerShown: false }}
                    />
                    <Stack.Screen name="index" />
                </Stack>
            </ThemeProvider>
        </AuthProvider>
    );
}
