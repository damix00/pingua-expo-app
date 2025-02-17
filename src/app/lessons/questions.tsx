import FlashcardTask from "@/components/lessons/tasks/FlashcardTask";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Question } from "@/types/course";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QuestionsLessonScreen() {
    const data = useLocalSearchParams<{ data: string }>();

    const parsed = useMemo(() => JSON.parse(data.data), [data]);
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    const questions: Question[] = useMemo(() => {
        return parsed.questions.map((question: any) => {
            return {
                id: question.id,
                type: question.type,
                question: question.question,
                audio: question.audio,
                answers: question.answers,
                correctAnswer: question.correctAnswer,
            };
        });
    }, [parsed]);

    if (questions.length == 0) {
        router.replace("/lessons/success?xp=5");

        return null;
    }

    let child = useMemo(() => {
        let c = <></>;

        const q = questions.shift();

        if (q?.type == "flashcard") {
            c = <FlashcardTask data={q as any} />;
        } else {
            console.log("Unknown question type", q);
        }
        return c;
    }, [questions]);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingTop: insets.top + 16,
                    paddingBottom: insets.bottom + 16,
                },
            ]}>
            {child}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
});
