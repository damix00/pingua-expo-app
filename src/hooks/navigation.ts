import { CommonActions } from "@react-navigation/native";
import { Route, useNavigation } from "expo-router";

export function usePopAllAndPush() {
    const navigation = useNavigation();

    return (route: string, params?: Record<string, any>) => {
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
    };
}
