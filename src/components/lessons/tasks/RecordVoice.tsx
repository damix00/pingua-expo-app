import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedText } from "@/components/ui/ThemedText";
import useHaptics from "@/hooks/useHaptics";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Question } from "@/types/course";
import { clamp } from "@/utils/util";
import { Circle, Lock, Mic } from "lucide-react-native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

export default function RecordVoiceTask({
    data,
    onComplete,
}: {
    data: Question;
    onComplete: () => any;
}) {
    const [completed, setCompleted] = useState(false);
    const colors = useThemeColors();
    const [recording, setRecording] = useState(false);
    const haptics = useHaptics();
    const { t } = useTranslation();
    const lockRelease = useRef<View>(null);

    const y = useSharedValue(0);
    const isHolding = useSharedValue(0);
    const isLocked = useSharedValue(false);

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
        })
        .onStart(() => {
            isHolding.value = withTiming(1, { duration: 200 });
            setRecording(true);
        })
        .onEnd(() => {
            setRecording(false);
            setCompleted(true);
        })
        .onFinalize((e) => {
            haptics.selectionAsync();

            lockRelease.current?.measure((fx, fy, width, height, px, py) => {
                if (e.absoluteY < py + height) {
                    isLocked.value = true;

                    y.value = withSpring(-72 - 32);
                } else {
                    isLocked.value = false;
                    y.value = withSpring(0);
                    isHolding.value = withTiming(0, { duration: 200 });
                }
            });
        });

    const onMove = Gesture.Pan()
        .runOnJS(true)
        .onChange((event) => {
            y.value += event.changeY;
        });

    const gesture = Gesture.Simultaneous(onMove, longPress);

    const btnStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                isHolding.value,
                [0, 1],
                [colors.card, colors.primary],
                "RGB"
            ),
            top: y.value,
        };
    });

    const lockReleaseStyle = useAnimatedStyle(() => {
        return {
            opacity: isHolding.value,
        };
    });

    const iconStyle = useAnimatedStyle(() => {
        return {
            opacity: isHolding.value,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.textWrapper}>
                <ThemedText type="secondary">
                    {t("lesson.questions.speak")}
                </ThemedText>
                <ThemedText style={styles.taskText} fontWeight="800">
                    {data.question}
                </ThemedText>
            </View>
            <View style={styles.btnWrapper}>
                <Animated.View
                    style={[
                        styles.lockRelease,
                        lockReleaseStyle,
                        {
                            borderColor: colors.outline,
                        },
                    ]}
                    ref={lockRelease}>
                    <Lock color={colors.textSecondary} size={32} />
                </Animated.View>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.btn, btnStyle]}>
                        <Mic
                            style={styles.icon}
                            color={colors.primary}
                            size={32}
                        />
                        <Animated.View style={[iconStyle, styles.icon]}>
                            <ThemedText
                                style={{
                                    color: colors.textOnPrimary,
                                    fontSize: 24,
                                }}>
                                ...
                            </ThemedText>
                        </Animated.View>
                    </Animated.View>
                </GestureDetector>
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
    textWrapper: {
        gap: 4,
        marginBottom: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    taskText: {
        fontSize: 24,
        textAlign: "center",
        marginTop: 8,
    },
    btn: {
        width: 72,
        height: 72,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
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
        top: -32 - 72,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        width: 72,
        height: 72,
        borderRadius: 12,
    },
});
