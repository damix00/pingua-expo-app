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
import { AudioLines, Volume, Volume2 } from "lucide-react-native";
import TranslatedText from "../TranslatedText";

export default function DialogueItem({
    data,
    onAudioEnd,
}: {
    data: DialogueLine;
    onAudioEnd: () => void;
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
                <ThemedText>{data.text}</ThemedText>
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
    },
});
