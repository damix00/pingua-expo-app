import { Course, SectionData, useAuth } from "@/context/AuthContext";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useCurrentCourse() {
    const auth = useAuth();
    const { i18n } = useTranslation();

    const currentCourse = useMemo(() => {
        if (!auth.courses || !auth.selectedCourse) {
            return null;
        }

        return (
            auth.courses.find((course) => course.id === auth.selectedCourse) ??
            auth.courses[0]
        );
    }, [auth?.courses, auth?.selectedCourse]);

    const currentCourseData = useMemo(() => {
        if (!auth.sectionData || !auth.selectedCourse) {
            return null;
        }

        return (
            auth.sectionData.find(
                (course) => course.id === auth.selectedCourse
            ) ?? auth.sectionData[0]
        );
    }, [auth?.sectionData, auth?.selectedCourse]);

    const updateCurrentCourse = useCallback(
        (data: Course) => {
            auth.setCourses(
                auth.courses.map((course) =>
                    course.id === data.id ? data : course
                )
            );
        },
        [auth]
    );

    if (
        !auth.courses ||
        !auth.sectionData ||
        !currentCourse ||
        !currentCourseData
    ) {
        return {
            currentCourse: null,
            currentCourseData: null,
            updateCurrentCourse: () => {},
            title: "",
        };
    }

    return {
        currentCourse,
        currentCourseData,
        updateCurrentCourse,
        title:
            // @ts-ignore
            currentCourseData[`title_${i18n.language}`] ??
            currentCourseData?.title ??
            "",
    };
}

export function useUnitTitle(sectionData: SectionData, unit: number) {
    const { i18n } = useTranslation();

    return (
        sectionData.unitTitles[unit][`title_${i18n.language}`] ??
        sectionData.unitTitles[unit].title
    );
}
