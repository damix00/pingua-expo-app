import { useThemeColors } from "@/hooks/useThemeColor";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedIosBlurView } from "../IosBlurView";
import { TextInput } from "react-native-gesture-handler";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { AnimatedThemedText, ThemedText } from "../ui/ThemedText";
import { Lightbulb } from "lucide-react-native";
import HapticNativeTouchable from "../input/button/HapticNativeTouchable";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

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

export default function ScenarioInput() {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const kbHeight = useKeyboardHeight(false);
    const scheme = useColorScheme();
    const { t } = useTranslation();
    const auth = useAuth();

    const animatedStyle = useAnimatedStyle(() => ({
        bottom: kbHeight.value + insets.bottom + 16,
    }));

    const [shouldReason, setShouldReason] = useState(auth.user?.plan != "FREE");

    return (
        <AnimatedIosBlurView
            tint={scheme == "light" ? "default" : "light"}
            style={[
                {
                    backgroundColor:
                        Platform.OS == "android"
                            ? colors.backgroundVariant
                            : colors.transparentBackgroundDarker,
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
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 12,
        marginBottom: 12,
    },
    chip: {
        borderRadius: 32,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
        gap: 4,
    },
});
