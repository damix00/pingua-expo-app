import { createContext } from "react";

export type AIScenario = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    aiRole: string;
    aiVoice: string;
    type: "beginner" | "intermediate" | "advanced" | "fluent";
};

export type ScenariosContextType = {
    scenarios: AIScenario[];
    loading: boolean;
    error: boolean;
    setScenarios: (scenarios: AIScenario[]) => void;
};

export const ScenariosContext = createContext<ScenariosContextType | null>(
    null
);

export function ScenariosProvider({
    scenarios,
    setScenarios,
    loading,
    error,
    ...props
}: {
    scenarios: AIScenario[];
    setScenarios: (scenarios: AIScenario[]) => void;
    loading: boolean;
    error: boolean;
    children: React.ReactNode;
}) {
    return (
        <ScenariosContext.Provider
            value={{
                loading,
                error,
                scenarios,
                setScenarios,
            }}
            {...props}
        />
    );
}
