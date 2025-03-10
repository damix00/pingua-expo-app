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
    useColorScheme,
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
import MenuBar from "./MenuBar";

const ITEM_SIZE = 42;

export default function SelectItem({
    items,
    activationDelay = 100,
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
    activationDelay?: number;
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
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const scheme = useColorScheme();

    const colors = useThemeColors();

    const triggerRef = useRef<View>(null);

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

            let yVal = py;

            if (yVal + height + menuBarHeight > windowHeight - insets.bottom) {
                yVal =
                    windowHeight -
                    (Platform.OS == "android" ? 0 : insets.bottom) -
                    height -
                    menuBarHeight -
                    24;
            }

            x.value = px;
            y.value = py;

            y.value = withTiming(yVal, {
                duration: 250,
                easing: Easing.out(Easing.sin),
            });

            itemWidth.value = width;
            itemHeight.value = height;
            itemOpacity.value = withTiming(0, {
                duration: 200,
            });
            setShown(true);
        });
    }, [triggerRef]);

    const scaleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value / 100 }],
        };
    }, [scale]);

    const onClose = useCallback(() => {
        itemOpacity.value = withTiming(1, {
            duration: 200,
        });
        setShown(false);
    }, []);

    const onBegin = useCallback(() => {
        timeout.current = setTimeout(() => {
            scale.value = withTiming(90, {
                duration: 500,
                easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
            });
        }, activationDelay);
    }, [activationDelay]);

    const onFinalize = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
    }, []);

    const longPress = Gesture.LongPress()
        .minDuration(activationDelay + 500)
        .onBegin(() => {
            runOnJS(onBegin)();
        })
        .onStart(() => {
            runOnJS(onLongPress)();
            scale.value = withSpring(100);
        })
        .onFinalize(() => {
            runOnJS(onFinalize)();
            scale.value = withSpring(100);
        });

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: itemOpacity.value,
        };
    });

    return (
        <>
            <Animated.View ref={triggerRef} style={[opacityStyle, scaleStyle]}>
                <GestureDetector gesture={longPress}>
                    {children}
                </GestureDetector>
            </Animated.View>
            <GestureHandlerRootView>
                <Modal
                    statusBarTranslucent
                    animationType="fade"
                    visible={shown}
                    transparent
                    onRequestClose={onClose}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1 }}
                        onPress={onClose}>
                        <BlurView
                            intensity={50}
                            tint={"default"}
                            experimentalBlurMethod="dimezisBlurView"
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
                                    pointerEvents="none"
                                    style={{
                                        width: itemWidth,
                                        height: itemHeight,
                                    }}>
                                    {children}
                                </Animated.View>
                                <MenuBar
                                    itemSize={ITEM_SIZE}
                                    items={items}
                                    onClose={onClose}
                                />
                            </Animated.View>
                        </BlurView>
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
});
