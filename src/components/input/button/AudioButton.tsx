import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { AudioLines, Volume2 } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function AudioButton({
    audioUri,
    onAudioEnd,
    width,
    height,
    iconSize = 20,
}: {
    audioUri: string;
    onAudioEnd?: () => void;
    width?: number;
    height?: number;
    iconSize?: number;
}) {
    const [sound, setSound] = useState<Audio.Sound | undefined>();
    const [isPlaying, setIsPlaying] = useState(false);
    const colors = useThemeColors();

    const initSound = async () => {
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
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
                if (onAudioEnd) {
                    onAudioEnd();
                }
            }, status.durationMillis);
        }

        setSound(sound);
    };

    useEffect(() => {
        if (!audioUri) {
            return;
        }

        initSound();
    }, [audioUri]);

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

        const timeout = setTimeout(fn, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [sound]);

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    return (
        <HapticTouchableOpacity
            onPress={() => {
                sound?.replayAsync();
            }}
            style={[
                styles.iconBtn,
                {
                    backgroundColor: colors.primaryContainer,
                    width: width || 36,
                    height: height || 36,
                },
            ]}>
            {isPlaying ? (
                <AudioLines size={iconSize} color={colors.primary} />
            ) : (
                <Volume2 size={iconSize} color={colors.primary} />
            )}
        </HapticTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    iconBtn: {
        borderRadius: 8,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
});
