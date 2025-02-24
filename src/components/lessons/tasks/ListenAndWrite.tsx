import { Question } from "@/types/course";
import { Keyboard, View } from "react-native";
import { TaskTitle } from "./task";
import { useTranslation } from "react-i18next";
import AudioButton from "@/components/input/button/AudioButton";
import { StyleSheet } from "react-native";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import Animated, {
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ui/ThemedText";
import TextInput from "@/components/input/TextInput";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { useCallback, useRef, useState } from "react";
import { compareTexts } from "@/utils/i18n";
import { useThemeColors } from "@/hooks/useThemeColor";
import useHaptics from "@/hooks/useHaptics";
import { NotificationFeedbackType } from "expo-haptics";

export default function ListenAndWriteTask({
    data,
    onComplete,
}: {
    data: Question;
    onComplete: (mistake: boolean) => any;
}) {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const keyboardHeight = useKeyboardHeight(false);
    const haptics = useHaptics();

    const madeMistake = useRef<boolean>(false);
    const inputData = useRef<string>("");
    const complete = useRef(false);

    const [taskCompleted, setTaskCompleted] = useState(false);
    const [inputError, setInputError] = useState<string>("");
    const [correct, setCorrect] = useState<boolean>(false);

    const resultStyle = useAnimatedStyle(
        () => ({
            opacity: withTiming(taskCompleted ? 1 : 0, {
                duration: 200,
            }),
            marginBottom: taskCompleted ? 16 : 0,
            gap: 2,
        }),
        [taskCompleted]
    );

    const handleComplete = useCallback(() => {
        Keyboard.dismiss();

        if (complete.current) {
            onComplete(madeMistake.current);
            return;
        }

        if (inputData.current.trim().length == 0) {
            setInputError("errors.field_required");
            return;
        }

        setInputError("");

        madeMistake.current = !compareTexts(inputData.current, data.question);
        setCorrect(!madeMistake.current);

        if (madeMistake.current) {
            haptics.notificationAsync(NotificationFeedbackType.Error);
        } else {
            haptics.notificationAsync(NotificationFeedbackType.Success);
        }

        setTaskCompleted(true);
        complete.current = true;

        setInputError("");
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingBottom: keyboardHeight,
                },
            ]}>
            <View>
                <ThemedText fontWeight="800" style={styles.titleText}>
                    {t("lesson.questions.listen_and_write")}
                </ThemedText>
                <View style={styles.task}>
                    <AudioButton audioUri={data.audio} />
                    <TextInput
                        errorKey={inputError}
                        onChangeText={(text) => {
                            inputData.current = text;
                        }}
                        containerStyle={{ flex: 1 }}
                        placeholder={t("lesson.questions.write_here")}
                    />
                </View>
            </View>
            <View style={styles.buttonWrapper}>
                <Animated.View style={resultStyle}>
                    <ThemedText
                        fontWeight="700"
                        style={{
                            textAlign: "center",
                            color: correct ? colors.correct : colors.error,
                        }}>
                        {correct
                            ? t("lesson.questions.correct")
                            : t("lesson.questions.incorrect")}
                    </ThemedText>
                    {inputData.current.trim() != data.question && (
                        <ThemedText
                            type="secondary"
                            style={{
                                textAlign: "center",
                                width: "100%",
                                fontSize: 12,
                            }}>
                            {t("lesson.questions.correct_form", {
                                form: data.question,
                            })}
                        </ThemedText>
                    )}
                </Animated.View>
                {!taskCompleted && (
                    <Button variant="text" onPress={() => onComplete(false)}>
                        <ButtonText>
                            {t("lesson.questions.cant_listen")}
                        </ButtonText>
                    </Button>
                )}
                <Button onPress={handleComplete}>
                    <ButtonText>
                        {taskCompleted
                            ? t("continue")
                            : t("lesson.questions.check")}
                    </ButtonText>
                </Button>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    titleText: {
        textAlign: "center",
        fontSize: 20,
    },
    task: {
        marginTop: 16,
        gap: 8,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    buttonWrapper: {
        flexDirection: "column",
        gap: 4,
    },
});
