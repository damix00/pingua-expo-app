import React, { useCallback } from "react";
import {
    Dimensions,
    Platform,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    StyleProps,
    interpolate,
    Extrapolation,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useThemeColors } from "@/hooks/useThemeColor";
import { deviceHasRoundCorners } from "@/utils/util";
import { BlurView } from "expo-blur";
import { useBoxShadow } from "@/hooks/useBoxShadow";

interface DismissableModalProps {
    children: React.ReactNode;
    onDismiss: () => void;
    style?: StyleProps;
}

function InnerGestureDismissableModal({
    children,
    onDismiss,
    style,
}: DismissableModalProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const prevTranslateX = useSharedValue(0);
    const prevTranslateY = useSharedValue(0);
    const opacity = useSharedValue(1);

    const colors = useThemeColors();
    const { width, height } = Dimensions.get("screen");
    const scheme = useColorScheme();
    const shadow = useBoxShadow("large");

    const handleDismiss = useCallback(() => {
        opacity.value = withTiming(0, { duration: 200 });
        setTimeout(() => {
            onDismiss();
        }, 200);
    }, []);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            prevTranslateX.value = translateX.value;
            prevTranslateY.value = translateY.value;
        })
        .onUpdate(({ translationX, translationY }) => {
            const decayFactor = 0.5;
            const biggerDecayFactor = 1;

            translateX.value =
                translationX *
                Math.exp(
                    (-(translationX < 0 ? biggerDecayFactor : decayFactor) *
                        Math.abs(translationX)) /
                        width
                );
            translateY.value =
                translationY *
                Math.exp(
                    (-(translationY < 0 ? biggerDecayFactor : decayFactor) *
                        Math.abs(translationY)) /
                        height
                );
        })
        .onEnd((event) => {
            if (
                translateX.value > width / 2.5 ||
                event.velocityX > 1000 ||
                translateY.value > height / 2.5 ||
                event.velocityY > 1000
            ) {
                // Apply velocity to the animation
                if (event.velocityX > event.velocityY) {
                    translateX.value = withSpring(
                        translateX.value < 0 ? -width : width,
                        {
                            velocity: event.velocityX,
                        }
                    );
                } else {
                    translateY.value = withSpring(
                        translateY.value < 0 ? -height : height,
                        {
                            velocity: event.velocityY,
                        }
                    );
                }

                runOnJS(handleDismiss)();
            } else {
                const damping = 15;

                translateX.value = withSpring(0, {
                    damping,
                });
                translateY.value = withSpring(0, {
                    damping,
                });
            }
        });

    const roundedCorners = deviceHasRoundCorners();

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
                {
                    scale: interpolate(
                        Math.max(translateX.value, translateY.value),
                        [-200, 0, 200],
                        [1.2, 1, 0.9],
                        Extrapolation.CLAMP
                    ),
                },
            ],
            borderRadius:
                translateX.value || translateY.value
                    ? roundedCorners
                        ? 50
                        : interpolate(
                              Math.abs(
                                  Math.max(translateX.value, translateY.value)
                              ),
                              [0, 100],
                              [0, 50],
                              Extrapolation.CLAMP
                          )
                    : 0,
        };
    });

    const overlayStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                Math.max(translateX.value, translateY.value),
                [0, height / 2],
                ["rgba(0,0,0,0.75)", "rgba(0,0,0,0)"]
            ),
        };
    });

    return (
        <Animated.View style={[{ opacity, flex: 1 }, overlayStyle]}>
            <BlurView
                experimentalBlurMethod="dimezisBlurView"
                tint={scheme == "dark" ? "dark" : "light"}
                intensity={Platform.OS == "android" ? 5 : 100}
                style={{
                    flex: 1,
                }}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View
                        style={[
                            {
                                borderCurve: "continuous",
                                flex: 1,
                                backgroundColor: colors.background,
                                overflow: "hidden",
                            },
                            shadow,
                            animatedStyle,
                            style,
                        ]}>
                        {children}
                    </Animated.View>
                </GestureDetector>
            </BlurView>
        </Animated.View>
    );
}

export default function GestureDismissableModal({
    children,
    onDismiss,
    style,
}: DismissableModalProps) {
    if (Platform.OS == "android") {
        return <View style={[{ flex: 1 }, style]}>{children}</View>;
    }

    return (
        <InnerGestureDismissableModal onDismiss={onDismiss} style={style}>
            {children}
        </InnerGestureDismissableModal>
    );
}
