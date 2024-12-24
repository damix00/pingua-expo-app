import { createContext, useContext, useState } from "react";

export type AuthUser = {
    id: string;
    avatar: string;
    username: string;
    name: string;
    email: string;
};

export type Course = {
    id: string;
    languageId: string;
    xp: number;
    level: number;
};

export type UserContextType = {
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    user: AuthUser | null;
    setUser: (user: AuthUser) => void;
    courses: Course[];
    setCourses: (courses: Course[]) => void;
};

export const AuthContext = createContext<UserContextType>({
    loggedIn: false,
    setLoggedIn: () => {},
    user: null,
    setUser: () => {},
    courses: [],
    setCourses: () => {},
});

export function AuthProvider({
    user,
    setUser,
    courses,
    setCourses,
    loggedIn,
    setLoggedIn,
    ...props
}: {
    children: React.ReactNode;
    user: AuthUser | null;
    setUser: (user: AuthUser) => void;
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
}) {
    return (
        <AuthContext.Provider
            value={{
                loggedIn,
                setLoggedIn,
                user,
                setUser,
                courses,
                setCourses,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
