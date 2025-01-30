import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, TextInputProps, View } from "react-native";
import { TextInput as RNTextInput } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import {
    Component,
    Ref,
    RefAttributes,
    useEffect,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

const AnimatedRNTextInput = Animated.createAnimatedComponent(RNTextInput);

export default function TextInput({
    style,
    containerStyle,
    title,
    errorKey,
    errorParams,
    highlightOnFocus = true,
    ...props
}: TextInputProps & {
    containerStyle?: ViewStyle;
    title?: string;
    errorKey?: string;
    highlightOnFocus?: boolean;
    errorParams?: Record<string, any>;
}) {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const shakeAnim = useSharedValue(0);
    const prevErrorKey = useRef<string | null>(null);
    const [focused, setFocused] = useState(false);

    const borderColor = useSharedValue(
        errorKey ? colors.error : focused ? colors.primary : colors.outline
    );

    useEffect(() => {
        borderColor.value = withTiming(
            errorKey ? colors.error : focused ? colors.primary : colors.outline,
            { duration: 100 }
        );
    }, [focused, errorKey]);

    const duration = 100;
    const shakeOffset = 5;

    useEffect(() => {
        if (errorKey) {
            shakeAnim.value = withSequence(
                withTiming(-shakeOffset, { duration }),
                withTiming(shakeOffset, { duration }),
                withTiming(-shakeOffset, { duration }),
                withTiming(shakeOffset, { duration }),
                withTiming(0, { duration })
            );
        }
        if (errorKey !== prevErrorKey.current) {
            prevErrorKey.current = errorKey ?? null;
        }
    }, [errorKey]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeAnim.value }],
            borderColor: borderColor.value,
        };
    });

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.textWrapper}>
                {title && <ThemedText>{title}</ThemedText>}
                {errorKey && (
                    <ThemedText style={styles.errorText} type="secondary">
                        {t(errorKey, errorParams)}
                    </ThemedText>
                )}
            </View>
            <AnimatedRNTextInput
                onFocus={() => {
                    if (highlightOnFocus) {
                        setFocused(true);
                    }
                }}
                onBlur={() => {
                    setFocused(false);
                }}
                placeholderTextColor={colors.textSecondary}
                style={[
                    styles.input,
                    {
                        color: colors.text,
                        backgroundColor: colors.background,
                    },
                    animatedStyle,
                    style,
                ]}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: 4,
    },
    textWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    errorText: {
        fontSize: 12,
        color: "red",
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 12,
        fontFamily: "Montserrat_400Regular",
        paddingHorizontal: 16,
        paddingVertical: 0,
        height: 36,
    },
});
