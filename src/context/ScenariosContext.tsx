import { createContext, useContext, useState } from "react";

export type AIScenario = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    aiRole: string;
    aiVoice: string;
    session_id: string | null;
    status: "finished" | "started" | null;
    type: "beginner" | "intermediate" | "advanced" | "fluent";
};

export type AIScenarioMessage = {
    id: string;
    content: string;
    userMessage: boolean;
    createdAt: string;
};

export type AIScenarioSession = {
    id: string;
    cmsId: string;
    completed: boolean;
    success: boolean;
    courseId: string;
    createdAt: string;
};

export type ScenariosContextType = {
    scenarios: AIScenario[];
    loading: boolean;
    error: boolean;
    setState: React.Dispatch<
        React.SetStateAction<{
            scenarios: AIScenario[];
            loading: boolean;
            error: boolean;
        }>
    >;
};

export const ScenariosContext = createContext<ScenariosContextType | null>(
    null
);

export function ScenariosProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState({
        scenarios: [] as AIScenario[],
        loading: true,
        error: false,
    });

    return (
        <ScenariosContext.Provider
            value={{
                scenarios: state.scenarios,
                loading: state.loading,
                error: state.error,
                setState,
            }}>
            {children}
        </ScenariosContext.Provider>
    );
}

export function useScenarios() {
    const context = useContext(ScenariosContext);
    if (!context) {
        throw new Error("useScenarios must be used within a ScenariosProvider");
    }
    return context;
}

export function useScenario(id: string) {
    const { scenarios } = useScenarios();
    return scenarios.find((scenario) => scenario.id === id);
}
