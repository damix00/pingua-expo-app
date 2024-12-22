import { usePreferences } from "@/context/PreferencesContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { BlurView } from "expo-blur";
import { createContext, useContext, useEffect } from "react";
import {
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

type ButtonVariant = "primary" | "secondary" | "primaryVariant";

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
    ...props
}: TouchableOpacityProps & { variant?: ButtonVariant; href?: string }) {
    const colors = useThemeColors();
    const preferences = usePreferences();
    const opacity = useSharedValue(props.disabled ? 0.4 : 1);

    useEffect(() => {
        opacity.value = withTiming(props.disabled ? 0.4 : 1, { duration: 300 });
    }, [props.disabled]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <ButtonContext.Provider value={{ variant: variant ?? "primary" }}>
            <Animated.View style={animatedStyle}>
                <HapticTouchableOpacity
                    {...props}
                    onPress={(e) => {
                        if (href) {
                            router.push(href as any);
                        }
                        props.onPress && props.onPress(e);
                    }}
                    style={[
                        styles.button,
                        {
                            backgroundColor:
                                variant == "primaryVariant"
                                    ? colors.primaryVariant
                                    : variant == "secondary"
                                    ? colors.background
                                    : colors.primary,
                            borderColor:
                                variant == "secondary"
                                    ? colors.primary
                                    : "transparent",
                            borderWidth: variant == "secondary" ? 1 : 0,
                        },
                        style,
                    ]}>
                    {children}
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
