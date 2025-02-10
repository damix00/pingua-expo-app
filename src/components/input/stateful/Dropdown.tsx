import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Check, ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface DropdownProps {
    values: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    textColor?: string;
    style?: ViewStyle;
    position?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    fontSize?: number;
    children?: React.ReactNode;
}

export default function Dropdown({
    values,
    selectedValue,
    onSelect,
    textColor = "black",
    style,
    position,
    fontSize,
    children,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(0);
    const colors = useThemeColors();

    useEffect(() => {
        rotation.value = withTiming(isOpen ? -180 : 0, { duration: 200 });
        opacity.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
    }, [isOpen]);

    const animatedArrowStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const animatedContentStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View style={{ position: "relative" }}>
            {children ? (
                children
            ) : (
                <TouchableOpacity
                    style={[styles.button, style]}
                    onPress={() => {
                        setIsOpen(!isOpen);
                    }}>
                    <ThemedText
                        style={{
                            color: textColor,
                            fontSize: fontSize || 16,
                        }}>
                        {selectedValue}
                    </ThemedText>
                    <Animated.View style={[animatedArrowStyle]}>
                        <ChevronDown color={textColor} size={20} />
                    </Animated.View>
                </TouchableOpacity>
            )}
            <Animated.View
                style={[
                    styles.contentContainer,
                    animatedContentStyle,
                    {
                        backgroundColor: colors.background,
                        top: position?.top || 32,
                        bottom: position?.bottom,
                        left: position?.left,
                        right: position?.right,
                        height:
                            values.length * 36 + 24 + (values.length - 1 * 4),
                    },
                ]}>
                {values.map((value) => (
                    <TouchableOpacity
                        style={styles.item}
                        key={value}
                        onPress={() => {
                            onSelect(value);
                            setIsOpen(false);
                        }}>
                        <ThemedText>{value}</ThemedText>
                        {value === selectedValue && (
                            <Check color={colors.primary} size={20} />
                        )}
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    contentContainer: {
        position: "absolute",
        overflow: "hidden",
        gap: 4,
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: "center",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    item: {
        paddingHorizontal: 16,
        height: 36,
        gap: 4,
        flexDirection: "row",
        alignItems: "center",
    },
});
