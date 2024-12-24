import { AuthUser } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserCacheType = {
    user: AuthUser | null;
    jwt: string | null;
};

export async function loadUserCache(): Promise<UserCacheType> {
    const user = await AsyncStorage.getItem("user");
    const jwt = await AsyncStorage.getItem("jwt");

    return {
        user: user ? JSON.parse(user) : null,
        jwt,
    };
}
