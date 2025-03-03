import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";

// Define the shape of the preferences object
export type PreferencesType = {
    hapticFeedback: boolean;
};

// Define the shape of the context object
export type PreferencesContextType = {
    preferences: PreferencesType;
    setPreferences: (preferences: PreferencesType) => void;
};

// Create the PreferencesContext with a default value of null
export const PreferencesContext = createContext<PreferencesContextType | null>(
    null
);

// Function to load preferences from AsyncStorage
export async function loadPreferences(): Promise<PreferencesType> {
    const hapticFeedback = await AsyncStorage.getItem("hapticFeedback");

    return {
        hapticFeedback: hapticFeedback === "true" || hapticFeedback == null,
    };
}

// Function to save preferences to AsyncStorage
export async function savePreferences(preferences: PreferencesType) {
    await AsyncStorage.setItem(
        "hapticFeedback",
        preferences.hapticFeedback.toString()
    );
}

// PreferencesProvider component to provide the preferences context to its children
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

// Custom hook to use the PreferencesContext
export const usePreferences = () => {
    const context = useContext(PreferencesContext);

    if (!context) {
        throw new Error(
            "usePreferences must be used within a PreferencesProvider"
        );
    }

    return context;
};
