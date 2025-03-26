import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColor";
import ChatHeader from "@/components/homescreen/chats/ChatHeader";
import IosBlurView from "@/components/IosBlurView";
import OnboardingAppbar from "@/app/onboarding/OnboardingAppbar";
import { BlurView } from "expo-blur";
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export default function AppRouter({ loggedIn }: { loggedIn: boolean }) {
    const colors = useThemeColors();

    const transparentHeader = useMemo(
        () => ({
            headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                borderBottomWidth: 0,
            },
            headerTitleStyle: {
                fontSize: 16,
                fontFamily: "Montserrat_700Bold",
            },
            headerTintColor: colors.text,
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

    return (
        <View style={{ flex: 1 }}>
            <Stack
                initialRouteName={loggedIn ? "(tabs)" : "onboarding/index"}
                screenOptions={{
                    animation: Platform.select({
                        android: "simple_push",
                        ios: "ios_from_right",
                    }),
                    headerTitleStyle: {
                        color: colors.text,
                        fontFamily: "Montserrat_600SemiBold",
                    },
                    headerBackButtonMenuEnabled: false,
                    headerBackButtonDisplayMode: "minimal",
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
                        header: () => <OnboardingAppbar adaptiveColor />,
                    }}
                />
                <Stack.Screen
                    name="auth/otp"
                    options={{
                        headerShown: true,
                        headerTransparent: true,
                        header: () => <OnboardingAppbar adaptiveColor />,
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
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="lessons/loading"
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                        animation: "fade",
                        animationDuration: 300,
                    }}
                />
                <Stack.Screen
                    name="lessons/story"
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                        animation: "fade",
                        animationDuration: 300,
                    }}
                />
                <Stack.Screen
                    name="lessons/success"
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                        animation: "fade",
                        animationDuration: 300,
                    }}
                />
                <Stack.Screen
                    name="lessons/new-section"
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                        animation: "fade",
                        animationDuration: 300,
                    }}
                />
                <Stack.Screen
                    name="lessons/questions"
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                        animation: "fade",
                        animationDuration: 300,
                    }}
                />
                <Stack.Screen
                    name="chats/[character]"
                    options={{
                        header: () => <ChatHeader />,
                        headerTransparent: true,
                        headerStyle: {
                            backgroundColor: "transparent",
                        },
                    }}
                />
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
                <Stack.Screen
                    name="legal/tos"
                    options={{
                        title: "Terms of Service",
                        headerBackButtonDisplayMode: "minimal",
                        headerBackButtonMenuEnabled: false,
                    }}
                />
                <Stack.Screen
                    name="legal/privacy-policy"
                    options={{
                        title: "Privacy Policy",
                        headerBackButtonDisplayMode: "minimal",
                        headerBackButtonMenuEnabled: false,
                    }}
                />
                <Stack.Screen
                    name="settings/index"
                    options={{
                        title: "Settings",
                        ...transparentHeader,
                    }}
                />
                <Stack.Screen
                    name="settings/premium"
                    options={{
                        title: "Premium",
                        ...transparentHeader,
                    }}
                />
                <Stack.Screen
                    name="settings/developer"
                    options={{
                        title: "Developer settings",
                    }}
                />
                <Stack.Screen
                    name="subscribe/index"
                    options={{
                        presentation: "card",
                        title: "Subscribe",
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="subscribe/success"
                    options={{
                        presentation: "card",
                        title: "Success!",
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="scenarios/[id]/index"
                    options={{
                        presentation:
                            Platform.OS == "ios" ? "transparentModal" : "card",
                        animation:
                            Platform.OS == "ios" ? "slide_from_bottom" : "fade",
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: "transparent",
                        },
                    }}
                />
                <Stack.Screen
                    name="scenarios/[id]/chat"
                    options={{
                        presentation: "card",
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="scenarios/[id]/history"
                    options={{
                        presentation: "card",
                        ...transparentHeader,
                    }}
                />
            </Stack>
        </View>
    );
}
