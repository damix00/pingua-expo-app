import { AuthUser, Course } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserCacheType = {
    user: AuthUser | null;
    jwt: string | null;
    courses: Course[];
};

export async function loadUserCache(): Promise<UserCacheType> {
    const user = await AsyncStorage.getItem("user");
    const jwt = await AsyncStorage.getItem("jwt");
    const courses = await AsyncStorage.getItem("courses");

    return {
        user: user ? JSON.parse(user) : null,
        jwt,
        courses: courses ? JSON.parse(courses) : [],
    };
}

export async function saveUserCache(
    user: AuthUser,
    jwt: string,
    courses: Course[]
) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("jwt", jwt);
    await AsyncStorage.setItem("courses", JSON.stringify(courses));
}

export async function clearUserCache() {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("jwt");
    await AsyncStorage.removeItem("courses");
}
