import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useEffect } from "react";
import { StyleSheet, useColorScheme, View, ViewProps } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { AnimatedThemedText } from "../ThemedText";
import HapticNativeTouchable from "@/components/input/button/HapticNativeTouchable";

export default function SelectableChip({
    selected,
    onSelect,
    text,
    style,
    ...props
}: ViewProps & {
    selected: boolean;
    onSelect: () => void;
    text: string;
}) {
    const colors = useThemeColors();
    const bgColor = useSharedValue(
        selected ? colors.primary : colors.backgroundVariant
    );
    const textColor = useSharedValue(
        selected ? colors.textOnPrimary : colors.text
    );
    const colorScheme = useColorScheme();

    useEffect(() => {
        bgColor.value = withTiming(
            selected ? colors.primary : colors.backgroundVariant,
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
    }, [selected, colorScheme]);

    return (
        <HapticNativeTouchable onPress={onSelect}>
            <Animated.View
                {...props}
                style={[
                    styles.container,
                    {
                        backgroundColor: bgColor,
                    },
                    style,
                ]}>
                <AnimatedThemedText style={{ color: textColor, fontSize: 12 }}>
                    {text}
                </AnimatedThemedText>
            </Animated.View>
        </HapticNativeTouchable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        height: 24,
        paddingHorizontal: 12,
        alignSelf: "flex-start",
        justifyContent: "space-evenly",
        gap: 4,
        alignItems: "center",
        flexDirection: "row",
    },
});
