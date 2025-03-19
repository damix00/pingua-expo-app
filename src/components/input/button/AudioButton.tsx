import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { AudioLines, Volume2 } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import path from "path-browserify";

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

    const getCachedAudioUri = async (uri: string) => {
        const cachedUri = await AsyncStorage.getItem(uri);
        if (cachedUri) {
            console.log("CACHE HIT", cachedUri);

            const fileInfo = await FileSystem.getInfoAsync(cachedUri);
            if (fileInfo.exists) {
                return cachedUri;
            }
        }
        return null;
    };

    const cacheAudioUri = async (uri: string, localUri: string) => {
        await AsyncStorage.setItem(uri, localUri);
    };

    const initSound = async () => {
        try {
            let localUri = await getCachedAudioUri(audioUri);
            if (!localUri) {
                console.log("CACHE MISS", audioUri);
                const { uri } = await FileSystem.downloadAsync(
                    audioUri,
                    path.join(
                        FileSystem.cacheDirectory!,
                        audioUri.split("/").pop()!
                    )
                );
                localUri = uri;
                await cacheAudioUri(audioUri, localUri);
            }

            const { sound } = await Audio.Sound.createAsync({ uri: localUri });
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
        } catch (e) {
            console.error(e);
        }
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
