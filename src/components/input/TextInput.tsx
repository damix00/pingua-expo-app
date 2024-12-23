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
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const AnimatedRNTextInput = Animated.createAnimatedComponent(RNTextInput);

export default function TextInput({
    style,
    title,
    errorKey,
    ...props
}: TextInputProps & { title?: string; errorKey?: string }) {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const shakeAnim = useSharedValue(0);
    const prevErrorKey = useRef<string | null>(null);

    const duration = 100;

    useEffect(() => {
        if (errorKey && errorKey !== prevErrorKey.current) {
            shakeAnim.value = withSequence(
                withTiming(-10, { duration }),
                withTiming(10, { duration }),
                withTiming(-10, { duration }),
                withTiming(10, { duration }),
                withTiming(0, { duration })
            );
            prevErrorKey.current = errorKey;
        }
    }, [errorKey]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeAnim.value }],
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.textWrapper}>
                {title && <ThemedText>{title}</ThemedText>}
                {errorKey && (
                    <ThemedText style={styles.errorText} type="secondary">
                        {t(errorKey)}
                    </ThemedText>
                )}
            </View>
            <AnimatedRNTextInput
                placeholderTextColor={colors.textSecondary}
                style={[
                    styles.input,
                    {
                        color: colors.text,
                        borderColor: colors.outline,
                        backgroundColor: colors.background,
                    },
                    errorKey && styles.inputError,
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
    inputError: {
        borderColor: "red",
    },
});
