import React, { memo, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useAnimatedStyle,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import {
    TapGestureHandler,
    TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

import { styles } from "./styles";
import {
    CONTEXT_MENU_STATE,
    HOLD_ITEM_TRANSFORM_DURATION,
    WINDOW_HEIGHT,
} from "../../constants";
import {
    BACKDROP_LIGHT_BACKGROUND_COLOR,
    BACKDROP_DARK_BACKGROUND_COLOR,
} from "./constants";
import { useInternal } from "../../hooks";

type Context = {
    startPosition: { x: number; y: number };
};

const BackdropComponent = () => {
    const { state, theme } = useInternal();
    // Workaround: remount BlurView when state changes
    const [showBlur, setShowBlur] = useState(false);

    useAnimatedReaction(
        () => state.value,
        () => {
            if (state.value === CONTEXT_MENU_STATE.ACTIVE) {
                runOnJS(setShowBlur)(true);
            } else {
                runOnJS(setShowBlur)(false);
            }
        },
        [state]
    );

    // Restore the original tap gesture handler so that a tap anywhere dismisses the menu.
    const tapGestureEvent = useAnimatedGestureHandler<
        TapGestureHandlerGestureEvent,
        Context
    >({
        onStart: (event, context) => {
            context.startPosition = { x: event.x, y: event.y };
        },
        onCancel: () => {
            state.value = CONTEXT_MENU_STATE.END;
        },
        onEnd: (event, context) => {
            const distance = Math.hypot(
                event.x - context.startPosition.x,
                event.y - context.startPosition.y
            );
            if (distance < 10 && state.value === CONTEXT_MENU_STATE.ACTIVE) {
                state.value = CONTEXT_MENU_STATE.END;
            }
        },
    });

    const animatedContainerStyle = useAnimatedStyle(() => ({
        top:
            state.value === CONTEXT_MENU_STATE.ACTIVE
                ? 0
                : withDelay(
                      HOLD_ITEM_TRANSFORM_DURATION,
                      withTiming(WINDOW_HEIGHT, { duration: 0 })
                  ),
        opacity: withTiming(state.value === CONTEXT_MENU_STATE.ACTIVE ? 1 : 0, {
            duration: HOLD_ITEM_TRANSFORM_DURATION,
        }),
    }));

    const animatedInnerContainerStyle = useAnimatedStyle(
        () => ({
            backgroundColor: BACKDROP_LIGHT_BACKGROUND_COLOR,
        }),
        [theme]
    );

    return (
        <TapGestureHandler onHandlerStateChange={tapGestureEvent}>
            <Animated.View style={[styles.container, animatedContainerStyle]}>
                {showBlur && (
                    // Set pointerEvents="none" on BlurView so that touches pass through to the TapGestureHandler.
                    <BlurView
                        key={state.value}
                        tint="default"
                        intensity={50}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none">
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFill,
                                animatedInnerContainerStyle,
                            ]}
                            pointerEvents="auto"
                        />
                    </BlurView>
                )}
            </Animated.View>
        </TapGestureHandler>
    );
};

export default memo(BackdropComponent);
