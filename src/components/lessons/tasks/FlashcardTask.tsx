import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from "react-native-reanimated";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Question } from "@/types/course";

export default function FlashcardTask({ data }: { data: Question }) {
    const isFlipped = useSharedValue(false);
    const duration = 500;
    const colors = useThemeColors();

    const regularCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(
            Number(isFlipped.value),
            [0, 1],
            [0, 180]
        );
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [{ rotateY: rotateValue }],
        };
    });

    const flippedCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(
            Number(isFlipped.value),
            [0, 1],
            [180, 360]
        );
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [{ rotateY: rotateValue }],
        };
    });

    const handlePress = useCallback(() => {
        isFlipped.value = !isFlipped.value;
    }, [isFlipped]);

    const cardStyle = {
        borderColor: colors.outline,
    };

    return (
        <HapticTouchableOpacity onPress={handlePress}>
            <Animated.View
                style={[
                    styles.regularCard,
                    styles.card,
                    regularCardAnimatedStyle,
                    cardStyle,
                ]}>
                <ThemedText>{data.question}</ThemedText>
            </Animated.View>
            <Animated.View
                style={[
                    styles.flippedCard,
                    styles.card,
                    flippedCardAnimatedStyle,
                    cardStyle,
                    {
                        backgroundColor: colors.card,
                    },
                ]}>
                <ThemedText>{data.correctAnswer}</ThemedText>
            </Animated.View>
        </HapticTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 200,
        height: 300,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        backfaceVisibility: "hidden",
    },
    regularCard: {
        position: "absolute",
        zIndex: 1,
    },
    flippedCard: {
        zIndex: 2,
    },
});
