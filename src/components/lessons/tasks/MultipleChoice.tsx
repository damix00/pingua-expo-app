import { AnimatedThemedText, ThemedText } from "@/components/ui/ThemedText";
import { Question } from "@/types/course";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TaskTitle } from "./task";
import { useThemeColors } from "@/hooks/useThemeColor";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { useCallback, useRef, useState } from "react";
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import useHaptics from "@/hooks/useHaptics";
import { NotificationFeedbackType } from "expo-haptics";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

function AnswerCard({
    answer,
    correct,
    onPress,
    shouldTakeFullWidth,
}: {
    answer: string;
    correct: boolean;
    onPress: (mistake: boolean) => void;
    shouldTakeFullWidth: boolean;
}) {
    const colors = useThemeColors();
    const isIncorrect = useSharedValue(0);
    const haptics = useHaptics();
    const pressed = useRef(false);
    const [disabled, setDisabled] = useState(false);

    const handlePress = useCallback(() => {
        onPress(!correct);
        if (!correct && !pressed.current) {
            setDisabled(true);
            haptics.notificationAsync(NotificationFeedbackType.Error);
            isIncorrect.value = withTiming(1, { duration: 200 });
        } else if (correct && !pressed.current) {
            setDisabled(true);
            haptics.notificationAsync(NotificationFeedbackType.Success);
            isIncorrect.value = withTiming(-1, { duration: 200 });
        }

        pressed.current = true;
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            borderColor: interpolateColor(
                isIncorrect.value,
                [-1, 0, 1],
                [colors.correct, "transparent", colors.error]
            ),
            backgroundColor: interpolateColor(
                isIncorrect.value,
                [-1, 0, 1],
                [colors.correctCard, colors.card, colors.errorCard]
            ),
            opacity: interpolate(
                isIncorrect.value,
                [-1, 0, 1],
                [1, 1, 0.25],
                Extrapolation.CLAMP
            ),
            borderWidth: 1,
        };
    }, [colors, isIncorrect]);

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(
                isIncorrect.value,
                [-1, 0, 1],
                [colors.correct, colors.primary, colors.error]
            ),
        };
    });

    return (
        <HapticTouchableOpacity
            style={[
                styles.answerCardWrapper,
                shouldTakeFullWidth && styles.answerCardFullWidth,
            ]}
            disabled={disabled}
            onPress={handlePress}>
            <Animated.View
                style={[
                    styles.answerCard,
                    animatedStyle,
                    shouldTakeFullWidth && styles.answerCardFullWidth,
                ]}>
                <AnimatedThemedText fontWeight="700" style={animatedTextStyle}>
                    {answer}
                </AnimatedThemedText>
            </Animated.View>
        </HapticTouchableOpacity>
    );
}

export default function MultipleChoiceTask({
    data,
    onComplete,
}: {
    data: Question;
    onComplete: (mistake: boolean) => any;
}) {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [madeMistake, setMadeMistake] = useState(false);

    if (!data.answers && data.type !== "multiple_choice") {
        return null;
    }

    const handlePress = useCallback((mistake: boolean) => {
        setMadeMistake(mistake);
        if (!mistake) {
            setButtonDisabled(false);
        }
    }, []);

    return (
        <View style={styles.container}>
            <TaskTitle
                title={t("lesson.questions.multiple_choice")}
                question={data.question}
            />
            <View style={styles.answerContainer}>
                <View style={styles.answers}>
                    {data.answers?.map((answer, index) => (
                        <AnswerCard
                            key={answer.answer}
                            answer={answer.answer}
                            correct={answer.correct}
                            onPress={handlePress}
                            shouldTakeFullWidth={
                                index == data.answers!.length - 1 &&
                                index % 2 == 0
                            }
                        />
                    ))}
                </View>
                <Button
                    disabled={buttonDisabled}
                    onPress={() => onComplete(madeMistake)}>
                    <ButtonText>{t("continue")}</ButtonText>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    answerContainer: {
        flex: 1,
        justifyContent: "flex-end",
        gap: 16,
    },
    answers: {
        marginTop: 16,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    answerCardWrapper: {
        width: "48%",
        aspectRatio: 1,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        elevation: 0,
        shadowOpacity: 0,
    },
    answerCardFullWidth: {
        width: "100%",
        aspectRatio: 2,
    },
    answerCard: {
        borderRadius: 8,
        width: "100%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
