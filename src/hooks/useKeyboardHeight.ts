import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function useKeyboardHeight(includeInset: boolean = true) {
    const insets = useSafeAreaInsets();
    const bottomInsets = includeInset ? insets.bottom : 0;

    const height = useSharedValue(bottomInsets);

    const easing = Easing.bezier(0.25, 0.1, 0.4, 1);

    useEffect(() => {
        if (Platform.OS == "android") {
            return;
        }

        const onKeyboardShow = (event: KeyboardEvent) => {
            height.value = withTiming(
                event.endCoordinates.height +
                    (includeInset ? 0 : -insets.bottom) +
                    (Platform.OS == "ios" ? 0 : insets.bottom),
                {
                    duration: event.duration || 250,
                    easing,
                }
            );
        };

        const onKeyboardHide = (event: KeyboardEvent) => {
            height.value = withTiming(bottomInsets, {
                duration: event.duration || 250,
                easing,
            });
        };

        const onShow = Keyboard.addListener("keyboardWillShow", (event) => {
            if (Platform.OS != "android") {
                onKeyboardShow(event);
            }
        });

        const onHide = Keyboard.addListener("keyboardWillHide", (event) => {
            if (Platform.OS != "android") {
                onKeyboardHide(event);
            }
        });

        return () => {
            onShow.remove();
            onHide.remove();
        };
    }, []);

    return height;
}
