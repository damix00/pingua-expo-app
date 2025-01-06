import { Course, useAuth } from "@/context/AuthContext";
import { CachedSvgUri } from "@/utils/cache/SVGCache";
import { findFlag } from "@/utils/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import HapticTouchableOpacity from "../input/button/HapticTouchableOpacity";
import { ThemedText } from "../ui/ThemedText";
import React from "react";

export default function CourseSelect({ onPress }: { onPress?: () => void }) {
    const auth = useAuth();
    const [course, setCourse] = useState<Course>(auth.courses[0]);

    const fallbackCourse = auth.courses[0];

    useEffect(() => {
        if (auth.loggedIn && auth.courses.length > 0 && !auth.selectedCourse) {
            auth.setSelectedCourse(fallbackCourse.id);
        }

        setCourse(
            auth.selectedCourse
                ? auth.courses.find((c) => c.id === auth.selectedCourse) ??
                      fallbackCourse
                : fallbackCourse
        );
    }, [auth]);
    return (
        <HapticTouchableOpacity onPress={onPress} style={styles.container}>
            <CachedSvgUri
                width={36}
                height={36}
                uri={findFlag(course.languageCode) ?? ""}
            />
        </HapticTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 16,
        marginRight: 8,
    },
    bottomSheetContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetContent: {
        padding: 16,
    },
});
