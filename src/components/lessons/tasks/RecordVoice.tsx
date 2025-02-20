import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { AnimatedThemedText, ThemedText } from "@/components/ui/ThemedText";
import useHaptics from "@/hooks/useHaptics";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Question } from "@/types/course";
import { clamp } from "@/utils/util";
import { Audio } from "expo-av";
import { Circle, Ellipsis, Lock, Mic } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { TaskTitle } from "./task";

export default function RecordVoiceTask({
    data,
    onComplete,
}: {
    data: Question;
    onComplete: () => any;
}) {
    const [completed, setCompleted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const colors = useThemeColors();
    const haptics = useHaptics();
    const { t } = useTranslation();
    const lockRelease = useRef<View>(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [voiceRecording, setVoiceRecording] =
        useState<Audio.Recording | null>(null);
    const [loading, setLoading] = useState(false);

    const x = useSharedValue(0);
    const isHolding = useSharedValue(0);
    const isLocked = useSharedValue(false);

    const ANIM_DURATION = 200;

    const askForPermission = useCallback(async () => {
        if (permissionResponse?.status !== "granted") {
            console.log("Requesting permission..");
            await requestPermission();
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log("Starting recording..");
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setVoiceRecording(recording);
            console.log("Recording started");
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }, [permissionResponse, requestPermission]);

    const stopRecording = useCallback(async () => {
        console.log("Stopping recording..");
        await voiceRecording?.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = voiceRecording?.getURI();
        setVoiceRecording(null);

        console.log("Recording stopped and stored at", uri);
    }, [voiceRecording]);

    const onStart = useCallback(() => {
        // Start recording
        if (!isRecording) {
            startRecording();
            setIsRecording(true);
        }
    }, [isRecording, startRecording]);

    const longPress = Gesture.LongPress()
        .minDuration(200)
        .shouldCancelWhenOutside(false)
        .maxDistance(
            Math.max(
                Dimensions.get("window").height,
                Dimensions.get("window").width
            )
        )
        .runOnJS(true)
        .onBegin(() => {
            haptics.selectionAsync();

            askForPermission();
        })
        .runOnJS(false)
        .onStart(() => {
            isHolding.value = withTiming(1, { duration: ANIM_DURATION });

            runOnJS(onStart)();
        })
        .runOnJS(true)
        .onFinalize((e) => {
            haptics.selectionAsync();

            lockRelease.current?.measure((fx, fy, width, height, px, py) => {
                if (e.absoluteX > px) {
                    isLocked.value = true;

                    x.value = withSpring(fx + width / 2);
                } else {
                    isLocked.value = false;
                    x.value = withSpring(0);
                    isHolding.value = withTiming(0, {
                        duration: ANIM_DURATION,
                    });
                    stopRecording();
                    setIsRecording(false);
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                        setCompleted(true);
                    }, 3000);
                }
            });
        })
        .enabled(!loading);

    const onMove = Gesture.Pan()
        .runOnJS(true)
        .onChange((event) => {
            x.value += event.changeX;
        })
        .enabled(!loading);

    const gesture = Gesture.Simultaneous(onMove, longPress);

    const btnStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                isHolding.value,
                [0, 1],
                [colors.card, colors.primary],
                "RGB"
            ),
            left: x.value,
        };
    });

    const lockReleaseStyle = useAnimatedStyle(() => {
        return {
            opacity: isHolding.value,
            transform: [
                {
                    scale: isHolding.value,
                },
            ],
        };
    });

    const iconStyle = useAnimatedStyle(() => {
        return {
            opacity: isHolding.value,
        };
    });

    const holdTextStyle = useAnimatedStyle(() => {
        return {
            opacity: loading
                ? withTiming(0, {
                      duration: ANIM_DURATION,
                  })
                : 1 - isHolding.value,
        };
    });

    const micIconStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(loading ? 0 : 1, {
                duration: ANIM_DURATION,
            }),
        };
    });

    const loaderStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(loading ? 1 : 0, {
                duration: ANIM_DURATION,
            }),
        };
    });

    return (
        <View style={styles.container}>
            <TaskTitle
                title={t("lesson.questions.speak")}
                question={data.question}
            />
            <View style={styles.btnWrapper}>
                <View style={styles.lockWrapper}>
                    <Animated.View
                        style={[
                            styles.lockRelease,
                            lockReleaseStyle,
                            {
                                borderColor: colors.outline,
                            },
                        ]}
                        ref={lockRelease}>
                        <Lock color={colors.textSecondary} size={24} />
                    </Animated.View>
                </View>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.btn, btnStyle]}>
                        <Animated.View style={[styles.icon, micIconStyle]}>
                            <Mic color={colors.primary} size={32} />
                        </Animated.View>
                        <Animated.View style={[iconStyle, styles.icon]}>
                            <Ellipsis
                                color={colors.textSecondaryOnPrimary}
                                size={32}
                            />
                        </Animated.View>
                        <Animated.View style={[loaderStyle, styles.icon]}>
                            <ActivityIndicator
                                size={Platform.OS === "ios" ? "small" : "large"}
                                color={colors.primary}
                            />
                        </Animated.View>
                    </Animated.View>
                </GestureDetector>
                <View style={styles.btnTextWrapper}>
                    <AnimatedThemedText
                        type="secondary"
                        style={[styles.recordText, holdTextStyle]}>
                        {t("lesson.questions.tap_to_record")}
                    </AnimatedThemedText>
                    <AnimatedThemedText
                        type="secondary"
                        style={[styles.recordText, loaderStyle]}>
                        {t("lesson.questions.voice_loading")}
                    </AnimatedThemedText>
                </View>
            </View>
            <Button disabled={!completed} onPress={onComplete}>
                <ButtonText>{t("continue")}</ButtonText>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
    },
    btn: {
        zIndex: 1,
        width: 72,
        height: 72,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        overflow: "hidden",
        position: "relative",
    },
    icon: {
        position: "absolute",
    },
    btnWrapper: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    lockRelease: {
        position: "absolute",
        left: 64,
        top: 0,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 100,
        width: 72,
        height: 72,
    },
    recordText: {
        marginTop: 8,
        fontSize: 12,
        position: "absolute",
    },
    btnTextWrapper: {
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
    },
    lockWrapper: {
        position: "relative",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
});
