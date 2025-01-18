import { ThemedText } from "@/components/ui/ThemedText";
import { Character, DialogueLine } from "@/types/course";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { useThemeColors } from "@/hooks/useThemeColor";
import { AudioLines, Volume, Volume2, X } from "lucide-react-native";
import TranslatedText from "../TranslatedText";
import React from "react";
import useHaptics from "@/hooks/useHaptics";
import { NotificationFeedbackType } from "expo-haptics";

function AnswerItem({
    data,
    onPress,
}: {
    data: DialogueLine["answers"][0];
    onPress: () => void;
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

    return (
        <Animated.View style={{ opacity, overflow: "hidden" }}>
            <TouchableOpacity
                disabled={disabled}
                onPress={() => {
                    if (!data.correct) {
                        haptics.notificationAsync(
                            NotificationFeedbackType.Error
                        );
                        setDisabled(true);
                    } else {
                        haptics.notificationAsync(
                            NotificationFeedbackType.Success
                        );
                    }

                    onPress();
                }}
                style={[
                    styles.answer,
                    {
                        backgroundColor: colors.primaryContainer,
                    },
                ]}>
                {/* {disabled && <X size={20} color={colors.error} />} */}
                <ThemedText>{data.text}</ThemedText>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function DialogueItem({
    data,
    onAudioEnd,
    onQuestionEnd,
}: {
    data: DialogueLine;
    onAudioEnd: () => void;
    onQuestionEnd: () => void;
}) {
    const [sound, setSound] = useState<Audio.Sound | undefined>();
    const opacity = useSharedValue(0);
    const colors = useThemeColors();
    const [isPlaying, setIsPlaying] = useState(false);

    const duration = 500;

    useEffect(() => {
        opacity.value = withTiming(1, { duration });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const initSound = async () => {
        if (!data.audio) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync({ uri: data.audio });
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        });

        const status = await sound.getStatusAsync();

        if (status.isLoaded) {
            setTimeout(() => {
                onAudioEnd();
            }, status.durationMillis);
        }

        setSound(sound);
    };

    useEffect(() => {
        const fn = () => {
            if (sound) {
                sound.playAsync();

                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        setIsPlaying(status.isPlaying);
                    }
                });
            }
        };

        const timeout = setTimeout(fn, duration);

        return () => {
            clearTimeout(timeout);
        };
    }, [sound]);

    useEffect(() => {
        if (!data.audio) {
            return;
        }

        initSound();
    }, [data.audio]);

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    return (
        <Animated.View style={[styles.item, animatedStyle]}>
            {data.audio && (
                <HapticTouchableOpacity
                    onPress={() => {
                        sound?.replayAsync();
                    }}
                    style={[
                        styles.iconBtn,
                        {
                            backgroundColor: colors.primaryContainer,
                        },
                    ]}>
                    {isPlaying ? (
                        <AudioLines size={20} color={colors.primary} />
                    ) : (
                        <Volume2 size={20} color={colors.primary} />
                    )}
                </HapticTouchableOpacity>
            )}
            {data.character == "user" ? (
                <View style={styles.userQuestionNrapper}>
                    <ThemedText type="subtitle">{data.text}</ThemedText>
                    <View style={styles.answers}>
                        {data.answers.map((item) => (
                            <AnswerItem
                                key={item.text}
                                data={item}
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
                <TranslatedText
                    text={data.text}
                    translation={data.text_app_language || ""}
                />
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
    iconBtn: {
        borderRadius: 8,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
});
