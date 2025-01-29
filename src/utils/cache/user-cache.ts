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
};

export async function loadUserCache(): Promise<UserCacheType> {
    const user = await AsyncStorage.getItem("user");
    const jwt = await AsyncStorage.getItem("jwt");
    const courses = await AsyncStorage.getItem("courses");
    const sectionData = await AsyncStorage.getItem("sectionData");
    const selectedCourse = await AsyncStorage.getItem("selectedCourse");
    const chats = await AsyncStorage.getItem("chats");

    return {
        user: user ? JSON.parse(user) : null,
        jwt,
        courses: courses ? JSON.parse(courses) : [],
        sectionData: sectionData ? JSON.parse(sectionData) : [],
        selectedCourse: selectedCourse ?? null,
        chats: chats ? JSON.parse(chats) : [],
    };
}

export async function saveUserCache(
    user: AuthUser,
    jwt: string,
    courses: Course[],
    sectionData: SectionData[],
    selectedCourse?: string | null,
    chats?: Chat[]
) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("jwt", jwt);
    await AsyncStorage.setItem("courses", JSON.stringify(courses));
    await AsyncStorage.setItem("sectionData", JSON.stringify(sectionData));
    await AsyncStorage.setItem("selectedCourse", selectedCourse || "");
    await AsyncStorage.setItem("chats", JSON.stringify(chats || []));
}

export async function clearUserCache() {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("jwt");
    await AsyncStorage.removeItem("courses");
    await AsyncStorage.removeItem("sectionData");
    await AsyncStorage.removeItem("selectedCourse");
    await AsyncStorage.removeItem("chats");
}
