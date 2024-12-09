import { createContext, useContext, useState } from "react";

export type AuthUser = {
    id: number;
    username: string;
    email: string;
};

export type UserContextType = {
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    user: AuthUser | null;
};

export const AuthContext = createContext<UserContextType>({
    loggedIn: false,
    setLoggedIn: () => {},
    user: null,
});

export function AuthProvider({
    user,
    loggedIn,
    setLoggedIn,
    ...props
}: {
    children: React.ReactNode;
    user: AuthUser | null;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
}) {
    return (
        <AuthContext.Provider
            value={{
                loggedIn,
                setLoggedIn,
                user,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
