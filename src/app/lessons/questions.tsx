import FlashcardTask from "@/components/lessons/tasks/FlashcardTask";
import ListenAndWriteTask from "@/components/lessons/tasks/ListenAndWrite";
import MultipleChoiceTask from "@/components/lessons/tasks/MultipleChoice";
import QuestionsAppbar from "@/components/lessons/tasks/QuestionsAppbar";
import RecordVoiceTask from "@/components/lessons/tasks/RecordVoice";
import TranslateTask from "@/components/lessons/tasks/TranslateTask";
import { ThemedText } from "@/components/ui/ThemedText";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Question } from "@/types/course";
import { clamp, sleep } from "@/utils/util";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QuestionsLessonScreen() {
    const data = useLocalSearchParams<{ data: string }>();
    const opacity = useSharedValue(1);

    const parsed = useMemo(() => {
        try {
            return JSON.parse(data.data);
        } catch (error) {
            console.error("Failed to parse data", error);
            return { questions: [] };
        }
    }, [data]);

    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const bottomSheet = useBottomSheet();
    const [touchEnabled, setTouchEnabled] = useState(true);

    const [progress, setProgress] = useState(0);
    const [questions, setQuestions] = useState<Question[]>(() =>
        parsed.questions.map((question: any) => ({
            id: question.id,
            type: question.type,
            question: question.question,
            audio: question.audio,
            answers: question.answers,
            correctAnswer: question.correctAnswer,
        }))
    );

    const [child, setChild] = useState<JSX.Element | null>(null);
    const mistakes = useRef(0);

    const TRANSITION_DURATION = 500;

    useEffect(() => {
        if (questions.length === 0) {
            router.replace("/lessons/success?xp=5");
        }
    }, [questions]);

    const getChild = useCallback(() => {
        const q = questions[0];

        if (!q) {
            return <View key="empty" />;
        }

        if (q && q?.audio) {
            console.log(q.type, q.audio);
        }

        switch (q?.type) {
            case "flashcard":
                return (
                    <FlashcardTask
                        key={q.id}
                        onComplete={handleComplete}
                        data={q as any}
                    />
                );
            case "record-voice":
                return (
                    <RecordVoiceTask
                        key={q.id}
                        onComplete={handleComplete}
                        data={q}
                    />
                );
            case "multiple-choice":
                return (
                    <MultipleChoiceTask
                        key={q.id}
                        onComplete={handleComplete}
                        data={q}
                    />
                );
            case "translate":
                return (
                    <TranslateTask
                        key={q.id}
                        onComplete={handleComplete}
                        data={q}
                    />
                );
            case "listen-and-write":
                return (
                    <ListenAndWriteTask
                        key={q.id}
                        onComplete={handleComplete}
                        data={q}
                    />
                );
            default:
                console.log("Unknown question type", q);
                return <View key="empty" />;
        }
    }, [questions]);

    const handleComplete = useCallback(async (mistake: boolean) => {
        if (mistake) {
            mistakes.current++;
        }

        opacity.value = withTiming(0, {
            duration: TRANSITION_DURATION / 2,
        });
        setTouchEnabled(false);

        await sleep(TRANSITION_DURATION / 2);

        setQuestions((prev) => prev.slice(1));

        await sleep(TRANSITION_DURATION / 2);

        opacity.value = withTiming(1, {
            duration: TRANSITION_DURATION / 2,
        });

        setTouchEnabled(true);
    }, []);

    useEffect(() => {
        setProgress(
            clamp(
                (parsed.questions.length - questions.length + 1) /
                    parsed.questions.length,
                0,
                1
            )
        );
    }, [questions.length, parsed.questions.length]);

    useEffect(() => {
        setChild(getChild());
    }, [getChild]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}>
            <QuestionsAppbar progress={progress} />
            <View
                style={{
                    flex: 1,
                }}
                pointerEvents={touchEnabled ? "auto" : "none"}>
                <Animated.ScrollView
                    alwaysBounceVertical={false}
                    contentContainerStyle={styles.container}
                    style={[
                        {
                            paddingTop: insets.top + 16 + 56,
                            paddingBottom: insets.bottom + 16,
                            opacity,
                        },
                    ]}>
                    {child}
                </Animated.ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
});
