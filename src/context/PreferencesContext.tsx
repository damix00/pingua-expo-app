import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";

export type PreferencesType = {
    hapticFeedback: boolean;
};

export type PreferencesContextType = {
    preferences: PreferencesType;
    setPreferences: (preferences: PreferencesType) => void;
};

export const PreferencesContext = createContext<PreferencesContextType | null>(
    null
);

export async function loadPreferences(): Promise<PreferencesType> {
    const hapticFeedback = await AsyncStorage.getItem("hapticFeedback");

    return {
        hapticFeedback: hapticFeedback === "true" || hapticFeedback == null,
    };
}

export function PreferencesProvider({
    preferences,
    setPreferences,
    ...props
}: {
    children: React.ReactNode;
    preferences: PreferencesType;
    setPreferences: (preferences: PreferencesType) => void;
}) {
    return (
        <PreferencesContext.Provider
            value={{
                preferences,
                setPreferences,
            }}>
            {props.children}
        </PreferencesContext.Provider>
    );
}

export const usePreferences = () => {
    return useContext(PreferencesContext);
};
