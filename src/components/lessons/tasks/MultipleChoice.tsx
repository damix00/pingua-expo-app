import { AnimatedThemedText, ThemedText } from "@/components/ui/ThemedText";
import { Question } from "@/types/course";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TaskTitle } from "./task";
import { useThemeColors } from "@/hooks/useThemeColor";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { useCallback, useEffect, useRef, useState } from "react";
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
import AudioButton from "@/components/input/button/AudioButton";

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

function AnswerCard({
    answer,
    correct,
    onPress,
    shouldDisable,
    shouldTakeFullWidth,
}: {
    answer: string;
    correct: boolean;
    onPress: (mistake: boolean) => void;
    shouldDisable: boolean;
    shouldTakeFullWidth: boolean;
}) {
    const colors = useThemeColors();
    const isIncorrect = useSharedValue(0);
    const haptics = useHaptics();
    const pressed = useRef(false);
    const opacity = useSharedValue(1);
    const [disabled, setDisabled] = useState(shouldDisable);

    useEffect(() => {
        setDisabled(shouldDisable);
        opacity.value = withTiming(shouldDisable ? 0.25 : 1, { duration: 200 });
    }, [shouldDisable]);

    const handlePress = useCallback(() => {
        onPress(!correct);
        if (!correct && !pressed.current) {
            setDisabled(true);
            haptics.notificationAsync(NotificationFeedbackType.Error);
            isIncorrect.value = withTiming(1, { duration: 200 });
            opacity.value = withTiming(0.25, {
                duration: 200,
            });
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
            opacity: opacity.value,
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
            textAlign: "center",
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

    const hasMistake = useRef(false);

    if (!data.answers && data.type !== "multiple_choice") {
        return null;
    }

    const handlePress = useCallback((mistake: boolean) => {
        if (mistake) {
            hasMistake.current = true;
        }
        if (!mistake) {
            setButtonDisabled(false);
        }
    }, []);

    return (
        <View style={styles.container}>
            {data.type == "listen-and-choose" ? (
                <View style={styles.questionContainer}>
                    <AudioButton audioUri={data.audio} />
                    <ThemedText fontWeight="800" style={styles.questionText}>
                        {t("lesson.questions.listen_and_choose")}
                    </ThemedText>
                </View>
            ) : (
                <TaskTitle
                    title={t("lesson.questions.multiple_choice")}
                    question={data.question}
                />
            )}
            <View style={styles.answerContainer}>
                <View style={styles.answers}>
                    {data.answers?.map((answer, index) => (
                        <AnswerCard
                            shouldDisable={!buttonDisabled && !answer.correct}
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
                    onPress={() => onComplete(hasMistake.current)}>
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
        padding: 16,
    },
    questionContainer: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexDirection: "row",
        paddingHorizontal: 24,
    },
    questionText: {
        fontSize: 24,
        textAlign: "left",
    },
});
