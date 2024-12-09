import { useThemeColors } from "@/hooks/useThemeColor";
import { createContext, useContext } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "primaryVariant";

export type ButtonContextType = {
    variant: ButtonVariant;
};

export const ButtonContext = createContext<ButtonContextType>({
    variant: "primary",
});

export function useButtonContext() {
    const ctx = useContext(ButtonContext);

    if (!ctx) {
        throw new Error("useButtonContext must be used within a ButtonContext");
    }

    return ctx;
}

export default function Button({
    children,
    style,
    variant,
    ...props
}: TouchableOpacityProps & { variant?: ButtonVariant }) {
    const colors = useThemeColors();

    return (
        <ButtonContext.Provider value={{ variant: variant ?? "primary" }}>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor:
                            variant == "primaryVariant"
                                ? colors.primaryVariant
                                : variant == "secondary"
                                ? colors.background
                                : colors.primary,

                        borderColor:
                            variant == "secondary"
                                ? colors.primary
                                : "transparent",
                        borderWidth: variant == "secondary" ? 1 : 0,
                    },
                    style,
                ]}
                {...props}>
                {children}
            </TouchableOpacity>
        </ButtonContext.Provider>
    );
}

const styles = StyleSheet.create({
    button: {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: 32,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
});
