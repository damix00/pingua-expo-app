import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function useKeyboardHeight(includeInset: boolean = true) {
    const insets = useSafeAreaInsets();
    const height = useSharedValue(includeInset ? insets.bottom : 0);

    const easing = Easing.bezier(0.25, 0.1, 0.4, 1);

    useEffect(() => {
        const didKeyboardShow = (event: KeyboardEvent) => {
            if (Platform.OS == "android") {
                onKeyboardShow({
                    ...event,
                    endCoordinates: {
                        ...event.endCoordinates,
                        height: event.endCoordinates.height + insets.bottom,
                    },
                });
            }
        };

        const didKeyboardHide = (event: KeyboardEvent) => {
            if (Platform.OS == "android") {
                onKeyboardHide(event);
            }
        };

        const onKeyboardShow = (event: KeyboardEvent) => {
            height.value = withTiming(event.endCoordinates.height, {
                duration: event.duration || 250,
                easing,
            });
        };

        const onKeyboardHide = (event: KeyboardEvent) => {
            height.value = withTiming(includeInset ? insets.bottom : 0, {
                duration: event.duration || 250,
                easing,
            });
        };

        const onShow = Keyboard.addListener("keyboardWillShow", (event) => {
            if (Platform.OS != "android") {
                onKeyboardShow(event);
            }
        });
        const didShow = Keyboard.addListener(
            "keyboardDidShow",
            didKeyboardShow
        );
        const onHide = Keyboard.addListener("keyboardWillHide", (event) => {
            if (Platform.OS != "android") {
                onKeyboardHide(event);
            }
        });
        const didHide = Keyboard.addListener(
            "keyboardDidHide",
            didKeyboardHide
        );

        return () => {
            onShow.remove();
            onHide.remove();
            didShow.remove();
            didHide.remove();
        };
    }, []);

    return height;
}
