import { BottomSheetModalProps } from "@gorhom/bottom-sheet";
import React, { createContext, useContext } from "react";

export type BottomSheetContextType = {
    setBottomSheet: (
        bottomSheet: React.ReactNode,
        props?: BottomSheetModalProps
    ) => void;
    showBottomSheet: (component: React.ReactNode) => void;
    hideBottomSheet: () => void;
};

export const BottomSheetContext = createContext<BottomSheetContextType | null>(
    null
);

export function GlobalBottomSheetProvider({
    setBottomSheet,
    showBottomSheet,
    hideBottomSheet,
    ...props
}: {
    children: React.ReactNode;
    setBottomSheet: (
        bottomSheet: React.ReactNode,
        props?: BottomSheetModalProps
    ) => void;
    showBottomSheet: (component: React.ReactNode) => void;
    hideBottomSheet: () => void;
}) {
    return (
        <BottomSheetContext.Provider
            value={{
                setBottomSheet,
                showBottomSheet,
                hideBottomSheet,
            }}>
            {props.children}
        </BottomSheetContext.Provider>
    );
}

export function useBottomSheet() {
    const ctx = useContext(BottomSheetContext);

    if (!ctx) {
        throw new Error(
            "useBottomSheet must be used within a BottomSheetProvider"
        );
    }

    return ctx;
}
