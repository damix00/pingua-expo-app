import { useThemeColors } from "@/hooks/useThemeColor";
import { Check } from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export default function CheckboxRadial({
    selected,
    borderVariant = "onBackground",
    ...props
}: {
    selected: boolean;
    borderVariant?: "onPrimary" | "onBackground";
} & ViewProps) {
    const colors = useThemeColors();

    const opacity = useSharedValue(selected ? 1 : 0);
    const animatedColor = useSharedValue(
        selected
            ? borderVariant === "onPrimary"
                ? colors.textSecondaryOnPrimary
                : colors.textSecondary
            : colors.primary
    );

    useEffect(() => {
        opacity.value = withTiming(selected ? 1 : 0, { duration: 100 });
        animatedColor.value = withTiming(
            selected
                ? colors.primary
                : borderVariant === "onPrimary"
                ? colors.textSecondaryOnPrimary
                : colors.textSecondary,
            { duration: 100 }
        );
    }, [selected]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            borderColor: animatedColor.value,
        };
    });

    return (
        <Animated.View
            {...props}
            style={[
                styles.container,
                animatedContainerStyle,
                {
                    borderColor:
                        borderVariant === "onPrimary"
                            ? colors.textSecondaryOnPrimary
                            : colors.textSecondary,
                },
                props.style,
            ]}>
            <Animated.View
                style={[
                    styles.inner,
                    animatedStyle,
                    {
                        backgroundColor:
                            borderVariant == "onPrimary"
                                ? "white"
                                : colors.primary,
                    },
                ]}>
                <Check
                    size={16}
                    color={
                        borderVariant == "onPrimary" ? colors.primary : "white"
                    }
                />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inner: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
});
