import IosBlurView, { AnimatedIosBlurView } from "@/components/IosBlurView";
import { ThemedText } from "@/components/ui/ThemedText";
import useHaptics from "@/hooks/useHaptics";
import { useThemeColors } from "@/hooks/useThemeColor";
import { BlurView } from "expo-blur";
import { useCallback, useRef, useState } from "react";
import {
    Dimensions,
    Keyboard,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    Easing,
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const ITEM_SIZE = 42;

export default function SelectItem({
    items,
    children,
}: {
    items: {
        text: string;
        onPress?: () => any;
        isTitle?: boolean;
        icon?: React.ReactNode;
        isDestructive?: boolean;
        withSeparator?: boolean;
    }[];
    children: React.ReactNode;
}) {
    const [shown, setShown] = useState(false);
    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const itemWidth = useSharedValue(0);
    const itemHeight = useSharedValue(0);
    const itemOpacity = useSharedValue(1);
    const scale = useSharedValue(100);
    const insets = useSafeAreaInsets();
    const haptics = useHaptics();

    const colors = useThemeColors();

    const triggerRef = useRef<View>(null);
    const [menuBarAlignment, setMenuBarAlignment] = useState<"left" | "right">(
        "left"
    );

    const onLongPress = useCallback(() => {
        Keyboard.dismiss();
        haptics.selectionAsync();

        triggerRef.current?.measure((fx, fy, width, height, px, py) => {
            // Estimate height of menu bar
            let menuBarHeight = 8;

            const windowWidth = Dimensions.get("window").width;
            const windowHeight = Dimensions.get("window").height;

            for (const item of items) {
                if (item.isTitle) {
                    menuBarHeight += 16;
                } else {
                    menuBarHeight += ITEM_SIZE;
                }
                if (item.withSeparator) {
                    menuBarHeight += 1;
                }
            }

            let yVal = 0;

            if (Platform.OS === "android") {
                yVal = py - insets.top;
            } else {
                yVal = py;
            }

            if (yVal + height + menuBarHeight > windowHeight - insets.bottom) {
                yVal =
                    windowHeight - insets.bottom - height - menuBarHeight - 24;
            }

            x.value = px;
            y.value = yVal;

            if (px > windowWidth / 2) {
                setMenuBarAlignment("right");
            } else {
                setMenuBarAlignment("left");
            }

            itemWidth.value = width;
            itemHeight.value = height;
            setTimeout(() => {
                itemOpacity.value = 0;
            }, 100);
            setShown(true);
        });
    }, [triggerRef]);

    const scaleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value / 100 }],
        };
    }, [scale]);

    const onClose = useCallback(() => {
        itemOpacity.value = 1;
        setShown(false);
    }, []);

    const longPress = Gesture.LongPress()
        .onBegin(() => {
            scale.value = withTiming(90, {
                duration: 500,
                easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
            });
        })
        .onStart(() => {
            runOnJS(onLongPress)();
            scale.value = withSpring(100);
        })
        .onFinalize(() => {
            scale.value = withSpring(100);
        });

    return (
        <>
            <Animated.View
                ref={triggerRef}
                style={[
                    {
                        opacity: itemOpacity,
                    },
                    scaleStyle,
                ]}>
                <GestureDetector gesture={longPress}>
                    {children}
                </GestureDetector>
            </Animated.View>
            <GestureHandlerRootView>
                <Modal
                    animationType="fade"
                    visible={shown}
                    transparent
                    onRequestClose={onClose}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1 }}
                        onPress={onClose}>
                        <AnimatedIosBlurView
                            style={[
                                {
                                    flex: 1,
                                    backgroundColor: colors.backdrop,
                                },
                            ]}>
                            <Animated.View
                                style={[
                                    {
                                        position: "absolute",
                                        top: y,
                                        left: x,
                                    },
                                    scaleStyle,
                                    styles.itemWrapper,
                                ]}>
                                <Animated.View
                                    style={{
                                        width: itemWidth,
                                        height: itemHeight,
                                    }}>
                                    {children}
                                </Animated.View>
                                <View
                                    style={[
                                        styles.menuBar,
                                        {
                                            backgroundColor: colors.background,
                                        },
                                    ]}>
                                    {items.map((item, index) => (
                                        <TouchableHighlight
                                            disabled={
                                                !item.onPress || item.isTitle
                                            }
                                            underlayColor={
                                                colors.backgroundVariant
                                            }
                                            style={{
                                                borderTopRightRadius:
                                                    index === 0 ? 8 : 0,
                                                borderTopLeftRadius:
                                                    index === 0 ? 8 : 0,
                                                borderBottomRightRadius:
                                                    index === items.length - 1
                                                        ? 8
                                                        : 0,
                                                borderBottomLeftRadius:
                                                    index === items.length - 1
                                                        ? 8
                                                        : 0,
                                            }}
                                            key={index}
                                            onPress={() => {
                                                item.onPress?.();
                                                onClose();
                                            }}>
                                            <View
                                                style={[
                                                    styles.item,
                                                    {
                                                        borderBottomWidth:
                                                            item.withSeparator ||
                                                            item.isTitle
                                                                ? 1
                                                                : 0,
                                                        borderBottomColor:
                                                            colors.outline,
                                                        height: item.isTitle
                                                            ? undefined
                                                            : ITEM_SIZE,
                                                        paddingVertical:
                                                            item.isTitle
                                                                ? 8
                                                                : undefined,
                                                    },
                                                ]}>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                        flex: 1,
                                                    }}>
                                                    <ThemedText
                                                        style={{
                                                            color: item.isDestructive
                                                                ? colors.error
                                                                : item.isTitle
                                                                ? colors.textSecondary
                                                                : colors.text,
                                                            flex: 1,
                                                            textAlign:
                                                                item.isTitle
                                                                    ? "center"
                                                                    : "left",
                                                            fontSize:
                                                                item.isTitle
                                                                    ? 12
                                                                    : undefined,
                                                        }}>
                                                        {item.text}
                                                    </ThemedText>
                                                    {item.icon}
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    ))}
                                </View>
                            </Animated.View>
                        </AnimatedIosBlurView>
                    </TouchableOpacity>
                </Modal>
            </GestureHandlerRootView>
        </>
    );
}

const styles = StyleSheet.create({
    itemWrapper: {
        flexDirection: "column",
        gap: 8,
    },
    menuBar: {
        borderRadius: 8,
        minWidth: 200,
        alignSelf: "center",
    },
    item: {
        padding: 12,
        height: ITEM_SIZE,
        flexDirection: "row",
    },
});
