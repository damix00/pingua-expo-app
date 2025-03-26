import { useAudioBubble } from "@/context/AudioBubbleContext";
import { Audio, InterruptionModeAndroid } from "expo-av";
import { InterruptionModeIOS } from "expo-av/src/Audio.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    clamp,
    FadeIn,
    FadeOut,
    useSharedValue,
    withDecay,
    withSpring,
} from "react-native-reanimated";
import IosBlurView from "../IosBlurView";
import { ThemedText } from "./ThemedText";
import { durationToTime } from "@/utils/util";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HapticNativeTouchable from "../input/button/HapticNativeTouchable";
import { Pause, Play, X } from "lucide-react-native";

export default function AudioBubble({ uri }: { uri: string }) {
    const soundRef = useRef<Audio.Sound>();
    const audioBubble = useAudioBubble();
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();

    const [duration, setDuration] = useState<number>(0);
    const [currentPosition, setCurrentPosition] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const prevY = useSharedValue(0);

    const yPos = useSharedValue(insets.top);

    const playSound = useCallback(async () => {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri });

        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        });

        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
                audioBubble.setAudioUrl("");
            }

            if (status.isLoaded) {
                if (duration != status.durationMillis) {
                    setDuration((status.durationMillis ?? 0) / 1000);
                }
                setCurrentPosition(status.positionMillis / 1000);

                if (status.isPlaying != isPlaying) {
                    setIsPlaying(status.isPlaying);
                }
            }
        });

        await sound.playAsync();
    }, [uri]);

    useEffect(() => {
        if (!uri || uri.length == 0) return;

        playSound();

        return () => {
            soundRef.current?.unloadAsync();
        };
    }, [uri]);

    if (!uri || uri.length == 0) return null;

    const { width, height } = Dimensions.get("window");

    const gesture = Gesture.Pan()
        .onStart(() => {
            prevY.value = yPos.value;
        })
        .onUpdate(({ translationY }) => {
            yPos.value = withSpring(
                clamp(
                    prevY.value + translationY,
                    insets.top,
                    height - insets.bottom - 56
                ),
                {
                    damping: 15,
                }
            );
        })
        .onFinalize((event) => {
            yPos.value = withDecay({
                velocity: event.velocityY,
                rubberBandEffect: true,
                clamp: [insets.top, height - insets.bottom - 56],
            });
        });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                    styles.container,
                    {
                        top: yPos,
                    },
                ]}>
                <IosBlurView
                    style={[
                        styles.innerBubble,
                        {
                            borderWidth: 1,
                            borderColor: colors.outline,
                        },
                    ]}>
                    <HapticNativeTouchable
                        onPress={() => {
                            if (isPlaying) {
                                soundRef.current?.pauseAsync();
                            } else {
                                soundRef.current?.playAsync();
                            }
                        }}>
                        {isPlaying ? (
                            <Pause size={24} color={colors.text} />
                        ) : (
                            <Play size={24} color={colors.text} />
                        )}
                    </HapticNativeTouchable>
                    <View style={styles.durations}>
                        <ThemedText>
                            {durationToTime(currentPosition)}
                        </ThemedText>
                    </View>
                    <HapticNativeTouchable
                        onPress={() => {
                            soundRef.current?.stopAsync();
                            soundRef.current?.unloadAsync();

                            audioBubble.setAudioUrl("");
                        }}>
                        <X size={24} color={colors.text} />
                    </HapticNativeTouchable>
                </IosBlurView>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        zIndex: 10,
        borderRadius: 16,
        overflow: "hidden",
        paddingHorizontal: 16,
    },
    innerBubble: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 16,
        padding: 16,
        gap: 4,
        overflow: "hidden",
    },
    durations: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
});
