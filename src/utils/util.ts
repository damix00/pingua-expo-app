import { Platform } from "react-native";
import * as Device from "expo-device";

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

export function formatDate(date: Date) {
    return `${addZero(date.getDate())}.${addZero(
        date.getMonth() + 1
    )}.${date.getFullYear()}.`;
}

export function deviceHasRoundCorners() {
    const info = Device.modelId as string;

    if (Platform.OS != "ios") return false;
    if (!info) return false;

    // iPhone SE 2nd gen
    if (info == "iPhone12,8") return false;

    const split = info.split(",");
    const mainName = split[0].split("iPhone")[1];

    return (
        parseInt(mainName) > 10 ||
        (parseInt(mainName) == 10 && parseInt(split[1]) >= 6)
    );
}

export function durationToTime(duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    return `${addZero(minutes)}:${addZero(seconds)}`;
}
