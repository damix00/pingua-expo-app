import { AuthUser, Course, SectionData } from "@/context/AuthContext";
import { Chat } from "@/context/ChatContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserCacheType = {
    user: AuthUser | null;
    jwt: string | null;
    courses: Course[];
    sectionData: SectionData[];
    selectedCourse: string | null;
    chats: Chat[];
    sectionCount: number;
};

export async function loadUserCache(): Promise<UserCacheType> {
    const user = await AsyncStorage.getItem("user");
    const jwt = await AsyncStorage.getItem("jwt");
    const courses = await AsyncStorage.getItem("courses");
    const sectionData = await AsyncStorage.getItem("sectionData");
    const selectedCourse = await AsyncStorage.getItem("selectedCourse");
    const chats = await AsyncStorage.getItem("chats");
    const sectionCount = await AsyncStorage.getItem("sectionCount");

    return {
        user: user ? JSON.parse(user) : null,
        jwt,
        courses: courses ? JSON.parse(courses) : [],
        sectionData: sectionData ? JSON.parse(sectionData) : [],
        selectedCourse: selectedCourse ?? null,
        chats: chats ? JSON.parse(chats) : [],
        sectionCount: parseInt(sectionCount || "1"),
    };
}

export async function saveUserCache(data: {
    user: AuthUser;
    jwt?: string;
    courses: Course[];
    sectionData: SectionData[];
    selectedCourse?: string | null;
    chats?: Chat[];
    sectionCount?: number;
}) {
    if (data.user !== undefined) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
    }
    if (data.jwt !== undefined) {
        await AsyncStorage.setItem("jwt", data.jwt);
    }
    if (data.courses !== undefined) {
        await AsyncStorage.setItem("courses", JSON.stringify(data.courses));
    }
    if (data.sectionData !== undefined) {
        await AsyncStorage.setItem(
            "sectionData",
            JSON.stringify(data.sectionData)
        );
    }
    if (data.selectedCourse !== undefined) {
        await AsyncStorage.setItem("selectedCourse", data.selectedCourse || "");
    }
    if (data.chats !== undefined) {
        await AsyncStorage.setItem("chats", JSON.stringify(data.chats || []));
    }
    if (data.sectionCount !== undefined) {
        await AsyncStorage.setItem(
            "sectionCount",
            data.sectionCount.toString() || "1"
        );
    }
}

export async function clearUserCache() {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("jwt");
    await AsyncStorage.removeItem("courses");
    await AsyncStorage.removeItem("sectionData");
    await AsyncStorage.removeItem("selectedCourse");
    await AsyncStorage.removeItem("chats");
    await AsyncStorage.removeItem("sectionCount");
}
