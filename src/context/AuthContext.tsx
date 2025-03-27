import { createContext, useContext } from "react";

export type Plan = "FREE" | "PREMIUM";

export type AuthUser = {
    id: string;
    avatar: string;
    username: string;
    name: string;
    email: string;
    xp: number;
    plan: Plan;
    planExpiresAt: Date | null;
    streak: {
        current: number;
        longest: number;
        lastDate: string;
    };
};

export type SectionCache = {
    title: string;
};

export type CourseSection = {
    id: string;
    finished: boolean;
    level: number;
    accessible: boolean;
    cachedData?: SectionCache;
};

export type Course = {
    id: string;
    appLanguageCode: string;
    languageCode: string;
    fluencyLevel: number;
    xp: number;
    level: number;
    section: CourseSection;
};

export type SectionData = {
    course_id: string;
    id: string;
    title: string;
    title_hr: string;
    level: number;
    unitCount: number;
    unitTitles: { [key: string]: string }[];
};

export type UserContextType = {
    sectionData: SectionData[];
    setSectionData: (sectionData: SectionData[]) => void;
    selectedCourse: string | null;
    setSelectedCourse: (course: string | null) => void;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    logout: () => void;
    sectionCount: number;
    setSectionCount: (sectionCount: number) => void;
};

export const AuthContext = createContext<UserContextType>({
    sectionData: [],
    setSectionData: () => {},
    selectedCourse: null,
    setSelectedCourse: () => {},
    loggedIn: false,
    setLoggedIn: () => {},
    user: null,
    setUser: () => {},
    courses: [],
    setCourses: () => {},
    logout: () => {},
    sectionCount: 0,
    setSectionCount: () => {},
});

export function AuthProvider({
    sectionData,
    setSectionData,
    selectedCourse,
    setSelectedCourse,
    user,
    setUser,
    courses,
    setCourses,
    loggedIn,
    setLoggedIn,
    sectionCount,
    setSectionCount,
    ...props
}: {
    sectionData: SectionData[];
    setSectionData: (sectionData: SectionData[]) => void;
    selectedCourse: string | null;
    setSelectedCourse: (course: string | null) => void;
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    sectionCount: number;
    setSectionCount: (sectionCount: number) => void;
    children: React.ReactNode;
}) {
    const logout = () => {
        setUser(null);
        setCourses([]);
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{
                sectionData,
                setSectionData,
                selectedCourse,
                setSelectedCourse,
                logout,
                loggedIn,
                setLoggedIn,
                user,
                setUser,
                courses,
                setCourses,
                sectionCount,
                setSectionCount,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
