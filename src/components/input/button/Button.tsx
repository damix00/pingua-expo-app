import { usePreferences } from "@/context/PreferencesContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { BlurView } from "expo-blur";
import { createContext, useContext, useEffect } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import HapticTouchableOpacity from "./HapticTouchableOpacity";

type ButtonVariant = "primary" | "secondary" | "primaryVariant" | "text";

export type ButtonContextType = {
    variant: ButtonVariant;
};

export const ButtonContext = createContext<ButtonContextType>({
    variant: "primary",
});

export function useButtonContext() {
    const ctx = useContext(ButtonContext);

    if (!ctx) {
        throw new Error("useButtonContext must be used within a ButtonContext");
    }

    return ctx;
}

export default function Button({
    children,
    style,
    variant,
    href,
    haptic = true,
    loading = false,
    ...props
}: TouchableOpacityProps & {
    variant?: ButtonVariant;
    href?: string;
    haptic?: boolean;
    loading?: boolean;
}) {
    const colors = useThemeColors();
    const preferences = usePreferences();
    const opacity = useSharedValue(props.disabled || loading ? 0.4 : 1);

    useEffect(() => {
        opacity.value = withTiming(props.disabled || loading ? 0.4 : 1, {
            duration: 300,
        });
    }, [props.disabled, loading]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            width: "100%",
        };
    });

    let bgColor = colors.primary;

    switch (variant) {
        case "secondary":
            bgColor = colors.background;
            break;
        case "primaryVariant":
            bgColor = colors.primaryVariant;
            break;
        case "primary":
            bgColor = colors.primary;
            break;
        case "text":
            bgColor = "transparent";
            break;
    }

    return (
        <ButtonContext.Provider value={{ variant: variant ?? "primary" }}>
            <Animated.View style={animatedStyle}>
                <HapticTouchableOpacity
                    {...props}
                    disabled={props.disabled || loading}
                    enableHaptics={haptic}
                    onPress={(e) => {
                        if (href) {
                            router.push(href as any);
                        }
                        props.onPress && props.onPress(e);
                    }}
                    style={[
                        styles.button,
                        {
                            backgroundColor: bgColor,
                            borderColor:
                                variant == "secondary"
                                    ? colors.primary
                                    : "transparent",
                            borderWidth: variant == "secondary" ? 1 : 0,
                            boxShadow:
                                variant == "text"
                                    ? "none"
                                    : styles.button.boxShadow,
                        },
                        style,
                    ]}>
                    {loading ? (
                        <ActivityIndicator
                            color={
                                variant == "primaryVariant"
                                    ? colors.textOnPrimary
                                    : variant == "secondary"
                                    ? colors.primary
                                    : colors.textOnPrimary
                            }
                        />
                    ) : (
                        children
                    )}
                </HapticTouchableOpacity>
            </Animated.View>
        </ButtonContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    button: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: 8,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
});
