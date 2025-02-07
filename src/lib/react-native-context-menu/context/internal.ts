import { createContext } from "react";
import type { CONTEXT_MENU_STATE } from "../constants";
import { MenuInternalProps } from "../components/menu/types";
import { SharedValue } from "react-native-reanimated";

export type InternalContextType = {
    state: SharedValue<CONTEXT_MENU_STATE>;
    theme: SharedValue<"light" | "dark">;
    menuProps: SharedValue<MenuInternalProps>;
    safeAreaInsets?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
};

// @ts-ignore
export const InternalContext = createContext<InternalContextType>();
