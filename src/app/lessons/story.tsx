import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { DialogueLine, Story } from "@/types/course";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { Easing, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import IosBlurView, { AnimatedIosBlurView } from "@/components/IosBlurView";
import { X } from "lucide-react-native";
import { useBottomSheet } from "@/context/BottomSheetContext";
import ExitBottomSheet from "@/components/lessons/ExitBottomSheet";
import DialogueItem from "@/components/lessons/story/DialogueItem";
import axios from "axios";
import { useCurrentCourse } from "@/hooks/course";
import Toast from "react-native-toast-message";
import ProgressBar from "@/components/lessons/story/ProgressBar";

const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

export default function StoryLessonScreen() {
    const { data } = useLocalSearchParams<{
        data: string;
    }>();
    const { t } = useTranslation();
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const course = useCurrentCourse();
    const [lines, setLines] = useState<(DialogueLine & { show: boolean })[]>(
        []
    );
    const listRef = useRef<FlatList<DialogueLine>>(null);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const bottomSheet = useBottomSheet();
    const [progress, setProgress] = useState<number>(0);

    const incorrectAnswers = useRef(0);
    const finished = useRef(false);

    const scrollY = useSharedValue(0);
    const MIN_HEIGHT = 64 + insets.top;
    const MAX_HEIGHT = 100 + insets.top;

    const animatedHeaderStyle = useAnimatedStyle(() => ({
        height: interpolate(
            scrollY.value,
            [0, 100],
            [MAX_HEIGHT, MIN_HEIGHT],
            Extrapolation.CLAMP
        ),
        gap: interpolate(scrollY.value, [0, 100], [16, 8], Extrapolation.CLAMP),
    }));

    const animatedListStyle = useAnimatedStyle(
        () => ({
            paddingTop:
                interpolate(
                    scrollY.value,
                    [0, 100],
                    [MAX_HEIGHT, MIN_HEIGHT],
                    Extrapolation.CLAMP
                ) + 16,
        }),
        [insets.top]
    );

    const animatedHeaderTextStyle = useAnimatedStyle(() => ({
        fontSize: interpolate(
            scrollY.value,
            [0, 100],
            [24, 18],
            Extrapolation.CLAMP
        ),
    }));

    const progressBarStyle = useAnimatedStyle(() => ({
        height: interpolate(
            scrollY.value,
            [0, 100],
            [8, 4],
            Extrapolation.CLAMP
        ),
    }));

    const updateLines = () => {
        let shouldDisableBtn = false;
        let shouldChangeProgress = true;

        setLines((prev) => {
            const len = prev.length;

            if (len == parsed.dialogue.length) {
                return prev;
            }

            const item = parsed.dialogue[len];

            if (item.audio) {
                shouldDisableBtn = true;
            }

            if (item.character == "user") {
                shouldChangeProgress = false;
                shouldDisableBtn = true;
            }

            return [...prev, { ...item, show: true }];
        });

        if (shouldDisableBtn) {
            setButtonEnabled(false);
        }

        if (shouldChangeProgress) {
            setProgress((prev) => prev + 1);
        }
    };

    const parsed = useMemo(() => JSON.parse(data || "") as Story, [data]);

    useEffect(() => {
        const fn = () => {
            if (lines.length == 0) {
                updateLines();
            }
        };

        const timeout = setTimeout(fn, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [parsed]);

    const onEnd = useCallback(async () => {
        const data = await axios.patch(
            `/v1/courses/${course.currentCourse.id}/lessons/${parsed.id}`,
            {
                mistakes: incorrectAnswers.current,
                type: "story",
            }
        );

        if (data.status != 200) {
            Toast.show({
                type: "error",
                text1: t("errors.something_went_wrong"),
            });
        }

        router.replace(`/lessons/success?xp=${data.data.xp}`);
    }, []);

    useEffect(() => {
        if (progress == parsed.dialogue.length && !finished.current) {
            // The story is finished
            finished.current = true;
            onEnd();
        }
    }, [progress]);

    if (!data || !parsed) {
        return (
            <ThemedView>
                <ThemedText>{t("errors.something_went_wrong")}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <View
            style={[
                {
                    backgroundColor: colors.background,
                },
                styles.screen,
            ]}>
            <AnimatedIosBlurView
                intensity={24}
                style={[
                    styles.header,
                    animatedHeaderStyle,
                    {
                        paddingTop: insets.top,
                        borderBottomColor: colors.outline,
                        backgroundColor:
                            Platform.OS == "ios"
                                ? colors.transparentBackground
                                : colors.background,
                    },
                ]}>
                <View style={styles.headerTop}>
                    <AnimatedThemedText
                        fontWeight="800"
                        style={[animatedHeaderTextStyle, styles.headerText]}>
                        {parsed.title}
                    </AnimatedThemedText>
                    <TouchableOpacity
                        onPress={() => {
                            bottomSheet.setBottomSheet(<ExitBottomSheet />);
                        }}
                        style={{
                            paddingHorizontal: 24,
                        }}>
                        <X size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <ProgressBar
                    style={progressBarStyle}
                    progress={(progress / parsed.dialogue.length) * 100}
                />
            </AnimatedIosBlurView>
            <Animated.FlatList
                ref={listRef}
                showsVerticalScrollIndicator={false}
                style={[animatedListStyle]}
                contentContainerStyle={{
                    marginBottom: insets.bottom + 64,
                    gap: 8,
                }}
                onScroll={(e) => {
                    scrollY.value = e.nativeEvent.contentOffset.y;
                }}
                data={lines.filter((item) => item.show)}
                keyExtractor={(item) => item.text}
                renderItem={({ item }) => (
                    <DialogueItem
                        data={item}
                        onAudioEnd={() => {
                            setButtonEnabled(true);
                        }}
                        onIncorrectAnswer={() => {
                            incorrectAnswers.current++;
                        }}
                        onQuestionEnd={() => {
                            setTimeout(() => {
                                setButtonEnabled(true);
                                updateLines();
                            }, 500);
                        }}
                    />
                )}
            />
            <View
                style={[
                    styles.buttonWrapper,
                    {
                        bottom: insets.bottom + 12,
                    },
                ]}>
                <Button
                    disabled={
                        !buttonEnabled || progress == parsed.dialogue.length
                    }
                    style={[styles.button]}
                    onPress={updateLines}>
                    <ButtonText>{t("lesson.story.continue")}</ButtonText>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        zIndex: 100,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
    },
    headerText: {
        textAlign: "left",
        width: "100%",
        flex: 1,
        paddingHorizontal: 24,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    buttonWrapper: {
        position: "absolute",
        width: "100%",
        paddingHorizontal: 24,
    },
    button: {
        width: "100%",
    },
});
