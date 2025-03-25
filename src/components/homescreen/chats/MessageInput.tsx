import { useThemeColors } from "@/hooks/useThemeColor";
import {
    Platform,
    StyleSheet,
    useColorScheme,
    Vibration,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import useHaptics from "@/hooks/useHaptics";
import { ImpactFeedbackStyle } from "expo-haptics";
import HapticNativeTouchable from "@/components/input/button/HapticNativeTouchable";
import { ArrowUp, Lightbulb } from "lucide-react-native";
import { AnimatedIosBlurView } from "@/components/IosBlurView";
import { AnimatedThemedText } from "@/components/ui/ThemedText";

function ToggleChip({
    icon,
    text,
    selected,
    onSelect,
}: {
    icon: any;
    text: string;
    selected?: boolean;
    onSelect?: () => void;
}) {
    const colors = useThemeColors();
    const bgColor = useSharedValue(selected ? colors.primary : "transparent");
    const borderColor = useSharedValue(
        selected ? colors.primary : colors.outlineVariant
    );
    const textColor = useSharedValue(
        selected ? colors.textOnPrimary : colors.text
    );
    const scheme = useColorScheme();

    useEffect(() => {
        bgColor.value = withTiming(selected ? colors.primary : "transparent", {
            duration: 200,
        });

        borderColor.value = withTiming(
            selected ? colors.primary : colors.outlineVariant,
            {
                duration: 200,
            }
        );

        textColor.value = withTiming(
            selected ? colors.textOnPrimary : colors.text,
            {
                duration: 200,
            }
        );
    }, [selected, scheme]);

    const Icon = useMemo(() => Animated.createAnimatedComponent(icon), [icon]);

    return (
        <HapticNativeTouchable onPress={onSelect} androidBorderRadius={32}>
            <Animated.View
                style={[
                    {
                        borderColor: borderColor,
                        backgroundColor: bgColor,
                    },
                    styles.chip,
                ]}>
                <Icon
                    // @ts-ignore
                    size={16}
                    color={textColor}
                />
                <AnimatedThemedText
                    style={{
                        fontSize: 12,
                        color: textColor,
                    }}>
                    {text}
                </AnimatedThemedText>
            </Animated.View>
        </HapticNativeTouchable>
    );
}

export default function MessageInput({
    onSend,
    disableSending = false,
}: {
    onSend: (message: string, shouldReason: boolean) => void;
    disableSending?: boolean;
}) {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const kbHeight = useKeyboardHeight(false);
    const scheme = useColorScheme();
    const { t } = useTranslation();
    const auth = useAuth();
    const haptics = useHaptics();

    const animatedStyle = useAnimatedStyle(() => ({
        bottom: kbHeight.value + insets.bottom + 16,
    }));

    const [shouldReason, setShouldReason] = useState(auth.user?.plan != "FREE");
    const [message, setMessage] = useState("");

    let canSend = !disableSending && message.trim().length > 0;

    const sendBtnStyle = useAnimatedStyle(
        () => ({
            opacity: withTiming(canSend ? 1 : 0, {
                duration: 200,
            }),
            pointerEvents: canSend ? "auto" : "none",
        }),
        [canSend]
    );

    const sendMessage = useCallback(() => {
        if (message.trim().length == 0) return;

        onSend(message.trim(), shouldReason);
        setMessage("");
    }, [message, shouldReason]);

    return (
        <AnimatedIosBlurView
            intensity={50}
            tint={scheme == "light" ? "default" : "light"}
            style={[
                {
                    backgroundColor:
                        Platform.OS == "android"
                            ? colors.backgroundVariant
                            : colors.transparentBackground,
                    borderColor: colors.outline,
                    borderWidth: 1,
                },
                animatedStyle,
                styles.container,
            ]}>
            <TextInput
                style={[
                    {
                        color: colors.text,
                    },
                    styles.input,
                ]}
                placeholder={t("scenarios.input_placeholder")}
                placeholderTextColor={colors.textSecondary}
                cursorColor={colors.primary}
                onChangeText={(text) => {
                    setMessage(text);
                }}
                value={message}
                multiline
            />
            <View style={styles.buttons}>
                <ToggleChip
                    selected={shouldReason}
                    onSelect={() => {
                        setShouldReason((prev) => !prev);
                    }}
                    text={t("scenarios.reason")}
                    icon={Lightbulb}
                />
                <Animated.View style={sendBtnStyle}>
                    <HapticNativeTouchable
                        androidBorderRadius={28}
                        onPress={sendMessage}>
                        <View
                            style={[
                                styles.sendButton,
                                {
                                    backgroundColor: colors.primary,
                                },
                            ]}>
                            <ArrowUp size={16} color={colors.textOnPrimary} />
                        </View>
                    </HapticNativeTouchable>
                </Animated.View>
            </View>
        </AnimatedIosBlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        marginHorizontal: 16,
        overflow: "hidden",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        flex: 1,
        borderRadius: 16,
        height: 96,
    },
    input: {
        textAlignVertical: "top",
        padding: 12,
        flex: 1,
        width: "100%",
        fontFamily: "Montserrat_500Medium",
    },
    buttons: {
        width: "100%",
        alignItems: "flex-end",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    chip: {
        borderRadius: 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        paddingHorizontal: 12,
        gap: 4,
        height: 28,
    },
    sendButton: {
        width: 28,
        height: 28,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
    },
});
