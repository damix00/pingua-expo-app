import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ui/ThemedText";
import { Character, characterNames, DialogueLine } from "@/types/course";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import { NotificationFeedbackType } from "expo-haptics";
import useHaptics from "@/hooks/useHaptics";
import DialogueTranslation from "./DialogueTranslation";
import DashedLine from "@/components/ui/Dashes";
import AudioButton from "@/components/input/button/AudioButton";

function AnswerItem({
    data,
    onPress,
    onIncorrect,
}: {
    data: DialogueLine["answers"][0];
    onPress: () => void;
    onIncorrect: () => void;
}) {
    const [disabled, setDisabled] = useState(false);
    const haptics = useHaptics();
    const colors = useThemeColors();

    const opacity = useSharedValue(1);

    useEffect(() => {
        if (disabled) {
            opacity.value = withTiming(0.25, { duration: 500 });
        }
    }, [disabled]);

    const handlePress = useCallback(() => {
        if (!data.correct) {
            haptics.notificationAsync(NotificationFeedbackType.Error);
            onIncorrect();
            setDisabled(true);
        } else {
            haptics.notificationAsync(NotificationFeedbackType.Success);
        }

        onPress();
    }, [data]);

    return (
        <Animated.View style={{ opacity, overflow: "hidden" }}>
            <TouchableOpacity
                disabled={disabled}
                onPress={handlePress}
                style={[
                    styles.answer,
                    {
                        backgroundColor: colors.primaryContainer,
                    },
                ]}>
                <ThemedText>{data.text}</ThemedText>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function DialogueItem({
    data,
    onAudioEnd,
    onQuestionEnd,
    onIncorrectAnswer,
}: {
    data: DialogueLine;
    onAudioEnd: () => void;
    onQuestionEnd: () => void;
    onIncorrectAnswer: () => void;
}) {
    const opacity = useSharedValue(0);
    const colors = useThemeColors();
    const { t } = useTranslation();
    const incorrectPressed = useRef(false);

    const duration = 500;

    useEffect(() => {
        opacity.value = withTiming(1, { duration });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const characterName = useMemo(() => {
        if (data.character == "narrator") {
            return t("narrator");
        }

        return characterNames[data.character as keyof typeof characterNames];
    }, [data.character, t]);

    return (
        <Animated.View style={[styles.item, animatedStyle]}>
            {data.audio && (
                <AudioButton audioUri={data.audio} onAudioEnd={onAudioEnd} />
            )}
            {data.character == "user" ? (
                <View style={styles.userQuestionNrapper}>
                    <ThemedText type="subtitle">{data.text}</ThemedText>
                    <View style={styles.answers}>
                        {data.answers.map((item) => (
                            <AnswerItem
                                key={item.text}
                                data={item}
                                onIncorrect={() => {
                                    if (!incorrectPressed.current) {
                                        incorrectPressed.current = true;
                                        onIncorrectAnswer();
                                    }
                                }}
                                onPress={() => {
                                    if (item.correct) {
                                        opacity.value = withTiming(0, {
                                            duration,
                                        });
                                        onQuestionEnd();
                                    }
                                }}
                            />
                        ))}
                    </View>
                </View>
            ) : (
                <DialogueTranslation translation={data.text_app_language || ""}>
                    <View style={styles.itemInner}>
                        <ThemedText
                            style={{ fontSize: 10 }}
                            fontWeight="600"
                            type="secondary">
                            {characterName}
                        </ThemedText>
                        <View style={styles.textInner}>
                            <ThemedText>{data.text}</ThemedText>
                            <DashedLine dashColor={colors.outline} />
                        </View>
                    </View>
                </DialogueTranslation>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    answer: {
        padding: 12,
        borderRadius: 8,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    userQuestionNrapper: {
        flexDirection: "column",
        gap: 8,
        width: "100%",
    },
    answers: {
        flexDirection: "column",
        gap: 8,
    },
    itemInner: {
        flexDirection: "column",
        gap: 2,
        flex: 1,
    },
    textInner: {
        gap: 2,
        alignSelf: "flex-start",
    },
});
