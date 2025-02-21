import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function objectToQueryString(obj: Record<string, any>) {
    return Object.keys(obj)
        .map((key) => `${key}=${obj[key]}`)
        .join("&");
}

export function addZero(num: number) {
    return num < 10 ? `0${num}` : num;
}

export function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}

export function getPlatformHeaderHeight() {
    return Platform.OS === "ios" ? 38 : 56;
}
