import { CommonActions } from "@react-navigation/native";
import { Route, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { BackHandler } from "react-native";

export function usePopAllAndPush() {
    const shouldWork = useRef(true);

    const navigation = useNavigation();

    const cbck = useCallback(
        (route: string, params?: Record<string, any>) => {
            if (!shouldWork.current) return;

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: route,
                            params,
                        },
                    ],
                })
            );

            shouldWork.current = false;
        },
        [navigation]
    );

    return cbck;
}

export function usePreventBack() {
    useEffect(() => {
        const listener = () => true;

        const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            listener
        );

        return () => {
            subscription.remove();
        };
    });
}
