import React, { useCallback } from "react";
import { Dimensions, Platform, StyleSheet, useColorScheme } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    StyleProps,
    interpolate,
    Extrapolation,
    withTiming,
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

export default function GestureDismissableModal({
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
            translateX.value =
                translationX *
                Math.exp((-decayFactor * Math.abs(translationX)) / width);
            translateY.value =
                translationY *
                Math.exp((-decayFactor * Math.abs(translationY)) / height);
        })
        .onEnd((event) => {
            if (
                translateX.value > width / 2 ||
                event.velocityX > 1000 ||
                translateY.value > height / 2 ||
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
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
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
                        [1.1, 1, 0.9],
                        Extrapolation.CLAMP
                    ),
                },
            ],
            borderRadius:
                translateX.value || translateY.value
                    ? roundedCorners
                        ? 50
                        : interpolate(
                              Math.max(translateX.value, translateY.value),
                              [0, 100],
                              [0, 50],
                              Extrapolation.CLAMP
                          )
                    : 0,
        };
    });

    return (
        <Animated.View style={{ opacity, flex: 1 }}>
            <BlurView
                experimentalBlurMethod="dimezisBlurView"
                tint={scheme == "dark" ? "dark" : "light"}
                intensity={100}
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
