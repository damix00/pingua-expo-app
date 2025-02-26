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

export async function savePreferences(preferences: PreferencesType) {
    await AsyncStorage.setItem(
        "hapticFeedback",
        preferences.hapticFeedback.toString()
    );
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
    const context = useContext(PreferencesContext);

    if (!context) {
        throw new Error(
            "usePreferences must be used within a PreferencesProvider"
        );
    }

    return context;
};
