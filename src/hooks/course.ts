import { SectionData, useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useCurrentCourse() {
    const auth = useAuth();

    const currentCourse = useMemo(
        () =>
            auth.courses.find((course) => course.id === auth.selectedCourse) ??
            auth.courses[0],
        [auth.courses, auth.selectedCourse]
    );

    const currentCourseData = useMemo(
        () =>
            auth.sectionData.find(
                (course) => course.id === auth.selectedCourse
            ) ?? auth.sectionData[0],
        [auth.sectionData, auth.selectedCourse]
    );

    return { currentCourse, currentCourseData };
}

export function useSectionTitle(sectionData: SectionData) {
    const { i18n } = useTranslation();

    // if (i18n.language == "en") {
    //     return sectionData.title;
    // }

    // @ts-ignore
    return sectionData[`title_${i18n.language}`] ?? sectionData.title;
}
