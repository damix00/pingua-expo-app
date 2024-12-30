import { useThemeColor } from "@/hooks/useThemeColor";
import { router, Stack } from "expo-router";
import { ChevronLeft, X } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CloseButton({ onPress }: { onPress?: () => void }) {
    const insets = useSafeAreaInsets();
    const textColor = useThemeColor("text");

    return (
        <TouchableOpacity
            style={[
                styles.closeButton,
                {
                    top: Platform.select({
                        android: insets.top,
                        ios: 0,
                    }),
                },
            ]}
            onPress={() => {
                if (onPress) {
                    onPress();
                } else {
                    router.dismiss();
                }
            }}>
            <X size={24} color={textColor} />
        </TouchableOpacity>
    );
}

export default function ModalLayout() {
    const insets = useSafeAreaInsets();
    const textColor = useThemeColor("text");

    return (
        <Stack
            screenOptions={{
                header: () => <CloseButton />,
            }}>
            <Stack.Screen
                name="index"
                options={{
                    presentation: "modal",
                    title: "Premium",
                }}
            />
            <Stack.Screen
                name="plans"
                options={{
                    presentation: "card",
                    title: "Plans",
                    header: () => (
                        <>
                            <TouchableOpacity
                                onPress={() => {
                                    router.back();
                                }}
                                style={[
                                    styles.back,
                                    {
                                        top: Platform.select({
                                            android: insets.top,
                                            ios: 0,
                                        }),
                                    },
                                ]}>
                                <ChevronLeft size={24} color={textColor} />
                            </TouchableOpacity>
                            <CloseButton
                                onPress={() => {
                                    router.dismiss();
                                    router.dismiss();
                                }}
                            />
                        </>
                    ),
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    back: {
        position: "absolute",
        top: 0,
        left: 0,
        paddingVertical: 36,
        paddingHorizontal: 24,
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0,
        paddingVertical: 36,
        paddingHorizontal: 24,
    },
});
