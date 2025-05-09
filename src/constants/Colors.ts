import { Platform } from "react-native";

const lightTheme = {
    primary: "#7d51ef",
    primaryContainer: "#E8DFFF",
    primaryVariant: "#895ef3",
    link: "#7D51EFa",
    linkOnPrimary: "38C4F6",
    text: "#000000",
    textOnPrimary: "#F3EAFF",
    textSecondary: "#837B8E",
    textSecondaryOnPrimary: "#CAB4E9",
    background: "#F6F2FF",
    backgroundDarker: "#7B7980",
    transparentBackground: "#F6F2FFad",
    transparentBackgroundDarker: "#e3dfedad",
    backgroundVariant: "#E1DBED",
    backgroundHighlight: "#c5c0cf",
    card: "#E8DFFF",
    icon: "#687076",
    tabIconDefault: "#687076",
    outline: "#D4D0D8",
    outlineSecondary: "#E1DBED",
    outlineVariant: "#C5C0CF",
    error: "#e62727",
    errorCard: "#f2d0d0",
    correct: "#2dba2f",
    correctCard: "#daf7da",
    backdrop: Platform.OS == "ios" ? "#00000039" : "#000000B7",
};

const darkTheme: typeof lightTheme = {
    primary: "#7d51ef",
    primaryContainer: "#2D2240",
    primaryVariant: "#895ef3",
    link: "#7D51EF",
    linkOnPrimary: "#38C4F6",
    text: "#FFFFFF",
    textOnPrimary: "#F3EAFF",
    textSecondary: "#887f94",
    textSecondaryOnPrimary: "#CAB4E9",
    background: "#1c1a1f",
    backgroundDarker: "#181818",
    transparentBackground: "#1c1a1fad",
    transparentBackgroundDarker: "#1c1a1fcc",
    backgroundVariant: "#242229",
    backgroundHighlight: "#383440",
    card: "#2D2240",
    icon: "#C5C5C5",
    tabIconDefault: "#C5C5C5",
    outline: "#444444",
    outlineSecondary: "#333333",
    outlineVariant: "#544f5c",
    error: "red",
    errorCard: "#4a1c1c",
    correct: "#2dba2f",
    correctCard: "#1f3d1f",
    backdrop: "#00000080",
};

export const Colors = {
    light: lightTheme,
    dark: darkTheme,
};
