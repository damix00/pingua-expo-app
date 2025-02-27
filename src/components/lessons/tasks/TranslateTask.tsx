import { Question } from "@/types/course";
import { TaskTitle } from "./task";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import TextInput from "@/components/input/TextInput";
import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { useCurrentCourse } from "@/hooks/course";
import { AnimatedThemedText, ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import useHaptics from "@/hooks/useHaptics";
import { NotificationFeedbackType } from "expo-haptics";

enum CorrectStatus {
    NONE,
    CORRECT,
    INCORRECT,
}

export default function TranslateTask({
    data,
    onComplete,
}: {
    data: Question;
    onComplete: (mistake: boolean) => any;
}) {
    const { t } = useTranslation();
    const colors = useThemeColors();

    const checked = useRef(false);
    const madeMistake = useRef(false);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentCourse = useCurrentCourse();

    const [inputError, setInputError] = useState<string>("");
    const translationInput = useRef<string>("");
    const correctOpacity = useSharedValue(0);
    const [correct, setCorrect] = useState<CorrectStatus>(CorrectStatus.NONE);

    const [correctTranslation, setCorrectTranslation] = useState<string>("");

    const haptics = useHaptics();
    const height = useKeyboardHeight(false);

    const correctTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            correctOpacity.value,
            [0, 1],
            [
                colors.text,
                correct == CorrectStatus.CORRECT
                    ? colors.correct
                    : colors.error,
            ]
        ),
        textAlign: "center",
        width: "100%",
    }));

    const handleCheck = useCallback(async () => {
        if (translationInput.current.length == 0) {
            setInputError(t("errors.field_required"));
            return;
        }

        if (!checked.current) {
            setLoading(true);

            try {
                const res = await axios.post(
                    `/v1/courses/${currentCourse.currentCourse!.id}/questions/${
                        data.id
                    }/check-translation?text=${data.question}`,
                    {
                        translation: translationInput.current,
                    }
                );

                madeMistake.current = !res.data.similarity;

                if (res.data.similarity) {
                    setCorrect(CorrectStatus.CORRECT);
                    haptics.notificationAsync(NotificationFeedbackType.Success);
                } else {
                    setCorrectTranslation(res.data.translation);
                    setCorrect(CorrectStatus.INCORRECT);
                    haptics.notificationAsync(NotificationFeedbackType.Error);
                }
                correctOpacity.value = withTiming(1, { duration: 200 });
            } catch (error) {
                setInputError(t("errors.something_went_wrong"));
                console.error("Failed to check translation", error);
            } finally {
                setInputError("");
                setCompleted(true);
                setLoading(false);
                checked.current = true;
            }
        } else {
            onComplete(madeMistake.current);
        }
    }, [t]);

    return (
        <View style={styles.container}>
            <TaskTitle
                title={t("lesson.questions.translate_task")}
                question={data.question}
            />

            <Animated.View
                style={[
                    styles.bottom,
                    {
                        paddingBottom: height,
                    },
                ]}>
                <View style={styles.inputTextContainer}>
                    <Animated.View
                        style={{
                            opacity: correctOpacity,
                            gap: 2,
                        }}>
                        <AnimatedThemedText
                            fontWeight="700"
                            style={correctTextStyle}>
                            {correct == CorrectStatus.CORRECT
                                ? t("lesson.questions.correct")
                                : correct == CorrectStatus.INCORRECT
                                ? t("lesson.questions.incorrect")
                                : ""}
                        </AnimatedThemedText>
                        {correct == CorrectStatus.INCORRECT && (
                            <ThemedText
                                type="secondary"
                                style={{
                                    textAlign: "center",
                                    width: "100%",
                                    fontSize: 12,
                                }}>
                                {t("lesson.questions.correct_translation", {
                                    translation: correctTranslation,
                                })}
                            </ThemedText>
                        )}
                    </Animated.View>
                    <TextInput
                        errorKey={inputError}
                        onChangeText={(text) => {
                            translationInput.current = text;
                        }}
                        editable={!completed && !loading}
                        placeholder={t(
                            "lesson.questions.translation_placeholder"
                        )}
                    />
                </View>
                <Button onPress={handleCheck} loading={loading}>
                    <ButtonText>
                        {completed
                            ? t("continue")
                            : t("lesson.questions.check")}
                    </ButtonText>
                </Button>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
    },
    bottom: {
        flex: 1,
        justifyContent: "flex-end",
        gap: 16,
    },
    inputTextContainer: {
        flexDirection: "column",
        gap: 4,
    },
});
