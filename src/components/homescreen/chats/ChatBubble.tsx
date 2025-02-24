import TranslateBottomSheet from "@/components/translate/TranslateBottomSheet";
import { ThemedText } from "@/components/ui/ThemedText";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { Message } from "@/context/ChatContext";
import { useCurrentCourse } from "@/hooks/course";
import { useThemeColors } from "@/hooks/useThemeColor";
import {
    Copy,
    Languages,
    SendHorizonal,
    Trash2,
    Volume2,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import axios from "axios";
import SelectItem from "@/components/input/stateful/select/SelectItem";

export default function ChatBubble({
    content,
    userMessage,
    loading,
    onDelete,
    chatId,
    messageId,
}: {
    content: string;
    userMessage: boolean;
    loading?: boolean;
    onDelete?: () => void;
    chatId: string;
    messageId: string;
}) {
    const colors = useThemeColors();
    const offset = useSharedValue(0);
    const { t } = useTranslation();
    const bottomSheet = useBottomSheet();
    const course = useCurrentCourse();

    useEffect(() => {
        if (loading) {
            offset.value = withRepeat(
                withSequence(
                    withTiming(2, { duration: 500 }),
                    withTiming(0, { duration: 500 })
                ),
                100
            );
        }
    }, []);

    const onTranslateBtnPress = useCallback(() => {
        bottomSheet.setBottomSheet(
            <TranslateBottomSheet
                fromLanguage={course.currentCourse!.languageCode}
                toLanguage={course.currentCourse!.appLanguageCode}
                fromText={content}
            />
        );
    }, [content, userMessage]);

    const iconSize = 18;

    const items = useMemo(
        () => [
            {
                text: t("message"),
                isTitle: true,
                onPress: () => {},
            },
            {
                text: t("copy"),
                onPress: async () => {
                    const result = await Clipboard.setStringAsync(content);

                    if (result) {
                        Toast.show({
                            type: "success",
                            text1: t("copied"),
                        });
                    } else {
                        Toast.show({
                            type: "error",
                            text1: t("errors.something_went_wrong"),
                        });
                    }
                },
                icon: <Copy size={iconSize} color={colors.text} />,
            },
            ...(userMessage
                ? []
                : [
                      {
                          text: t("listen"),
                          onPress: async () => {
                              const data = await axios.post(
                                  `/v1/chats/${chatId}/messages/${messageId}/tts`,
                                  {
                                      language:
                                          course.currentCourse!.languageCode,
                                  }
                              );

                              if (data.status != 200) {
                                  return;
                              }

                              const { sound } = await Audio.Sound.createAsync({
                                  uri: data.data.url,
                              });

                              await Audio.setAudioModeAsync({
                                  playsInSilentModeIOS: true,
                                  allowsRecordingIOS: false,
                                  interruptionModeIOS:
                                      InterruptionModeIOS.DoNotMix,
                                  shouldDuckAndroid: true,
                                  interruptionModeAndroid:
                                      InterruptionModeAndroid.DoNotMix,
                              });

                              await sound.playAsync();
                          },
                          icon: <Volume2 size={iconSize} color={colors.text} />,
                      },
                  ]),
            {
                text: t("translate"),
                onPress: onTranslateBtnPress,
                withSeparator: true,
                icon: <Languages size={iconSize} color={colors.text} />,
            },
            {
                text: t("delete_text"),
                isDestructive: true,
                onPress: onDelete,
                icon: <Trash2 size={iconSize} color={colors.error} />,
            },
        ],
        [content, userMessage]
    );

    return (
        <SelectItem items={items}>
            <View
                style={[
                    styles.parent,
                    {
                        alignSelf: userMessage ? "flex-end" : "flex-start",
                    },
                ]}>
                <View
                    style={[
                        styles.bubble,
                        {
                            backgroundColor: userMessage
                                ? colors.primary
                                : colors.card,
                            opacity: loading ? 0.5 : 1,
                        },
                    ]}>
                    <ThemedText
                        style={styles.text}
                        type={userMessage ? "onPrimary" : undefined}>
                        {content}
                    </ThemedText>
                </View>
                <Animated.View
                    style={{
                        transform: [{ translateY: offset }],
                    }}>
                    {loading && (
                        <SendHorizonal
                            color={colors.textSecondary}
                            size={16}
                            style={styles.sendingIndicator}
                        />
                    )}
                </Animated.View>
            </View>
        </SelectItem>
    );
}

const styles = StyleSheet.create({
    parent: {
        flexDirection: "row",
        alignItems: "flex-end",
        maxWidth: "80%",
    },
    sendingIndicator: {
        marginBottom: 4,
        marginLeft: 4,
    },
    bubble: {
        padding: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    text: {
        lineHeight: 20, // emojis change the line height so we need to set it manually
    },
});
