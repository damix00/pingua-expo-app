import React, { useCallback, useState } from "react";
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
import { useTranslation } from "react-i18next";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";

export default function FlashcardTask({
    data,
    onComplete,
}: {
    data: Question;
    onComplete: () => any;
}) {
    const isFlipped = useSharedValue(false);
    const duration = 500;
    const colors = useThemeColors();
    const { t } = useTranslation();
    const [flipped, setFlipped] = useState(false);

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
        if (!flipped) {
            setFlipped(true);
        }
        isFlipped.value = !isFlipped.value;
    }, [isFlipped]);

    const cardStyle = {
        borderColor: colors.outline,
    };

    return (
        <View style={styles.container}>
            <View style={styles.textWrapper}>
                <ThemedText
                    type="secondary"
                    fontWeight="800"
                    style={{
                        fontSize: 12,
                    }}>
                    {t("lesson.questions.new_word")}
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: 16,
                    }}>
                    {t("lesson.questions.tap_to_see_translation")}
                </ThemedText>
            </View>
            <View style={styles.cardWrapper}>
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
            </View>
            <Button disabled={!flipped} onPress={onComplete}>
                <ButtonText>Continue</ButtonText>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignContent: "center",
        flexDirection: "column",
    },
    textWrapper: {
        gap: 4,
        marginBottom: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    cardWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
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
