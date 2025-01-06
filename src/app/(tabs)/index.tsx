import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useCurrentCourse, useSectionTitle } from "@/hooks/course";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useMemo } from "react";
import { ScrollView } from "react-native";

export default function Index() {
    const auth = useAuth();
    const colors = useThemeColors();

    const { currentCourse, currentCourseData } = useCurrentCourse();
    const title = useSectionTitle(currentCourseData);

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
                paddingHorizontal: 24,
                backgroundColor: colors.background,
            }}>
            <ThemedText>{title}</ThemedText>
        </ScrollView>
    );
}
