import { Course, useAuth } from "@/context/AuthContext";
import { CachedSvgUri } from "@/utils/cache/SVGCache";
import { findFlag } from "@/utils/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import HapticTouchableOpacity from "../../input/button/HapticTouchableOpacity";
import { ThemedText } from "../../ui/ThemedText";
import React from "react";
import { Flame } from "lucide-react-native";

export default function HomeHeaderActions({
    onCourseSelect,
    onStreakSelect,
}: {
    onCourseSelect?: () => void;
    onStreakSelect?: () => void;
}) {
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
        <View style={styles.container}>
            <HapticTouchableOpacity onPress={onCourseSelect}>
                <CachedSvgUri
                    width={36}
                    height={36}
                    uri={findFlag(course.languageCode) ?? ""}
                />
            </HapticTouchableOpacity>
            <HapticTouchableOpacity
                onPress={onStreakSelect}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                <Flame color="red" size={20} fill="red" />
                <ThemedText fontWeight="600">
                    {auth.user?.streak?.current ?? 0}
                </ThemedText>
            </HapticTouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 16,
        marginRight: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
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
