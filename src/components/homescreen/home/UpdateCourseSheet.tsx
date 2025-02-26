import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ThemedText } from "../../ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/hooks/useThemeColor";
import { CachedSvgUri } from "@/utils/cache/SVGCache";
import { courseLanguages, findFlag } from "@/utils/i18n";
import { StyleSheet, View } from "react-native";
import Button from "../../input/button/Button";
import ButtonText from "../../input/button/ButtonText";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { useCurrentCourse } from "@/hooks/course";
import OverlayDropdown from "@/components/input/stateful/OverlayDropdown";
import { ChevronDown } from "lucide-react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import useHaptics from "@/hooks/useHaptics";
import { NotificationFeedbackType } from "expo-haptics";
import { saveUserCache } from "@/utils/cache/user-cache";

function SelectItem({
    title,
    items,
    onSelect,
    selectedValue,
}: {
    title: string;
    items: { label: string; value: string }[];
    onSelect: (value: string) => void;
    selectedValue: string;
}) {
    const { t } = useTranslation();
    const course = useCurrentCourse();
    const colors = useThemeColors();

    return (
        <OverlayDropdown
            onSelect={onSelect}
            selectedValue={selectedValue}
            items={items}>
            <View style={styles.selectItem}>
                <ThemedText type="secondary">{title}</ThemedText>
                <View style={styles.selectValue}>
                    <ThemedText fontWeight="800">
                        {t(`languages.${selectedValue}`)}
                    </ThemedText>
                    <ChevronDown size={16} color={colors.textSecondary} />
                </View>
            </View>
        </OverlayDropdown>
    );
}

export default function UpdateCourseSheet() {
    const auth = useAuth();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const colors = useThemeColors();

    const course = useCurrentCourse();
    const bottomSheet = useBottomSheet();

    const haptics = useHaptics();

    const [loading, setLoading] = useState(false);
    const [courseCode, setCourseCode] = useState(
        course.currentCourse?.languageCode ?? "en"
    );
    const [baseCode, setBaseCode] = useState(
        course.currentCourse?.appLanguageCode ?? "en"
    );

    const handlePress = useCallback(async () => {
        try {
            setLoading(true);

            const result = await axios.patch(
                `/v1/courses/${course.currentCourse?.id}`,
                {
                    app_language: baseCode,
                    course_language: courseCode,
                }
            );

            if (result.status === 200) {
                course.updateCurrentCourse(result.data.course);

                const me = await axios.get("/v1/auth/me");
                auth.setSectionData(me.data.section_data);

                await saveUserCache({
                    user: me.data.user,
                    courses: me.data.courses,
                    sectionData: me.data.section_data,
                });

                haptics.notificationAsync(NotificationFeedbackType.Success);

                bottomSheet.hideBottomSheet();
            }
        } catch (e) {
            console.error(e);

            Toast.show({
                type: "error",
                text1: t("errors.something_went_wrong"),
            });
        } finally {
            setLoading(false);
        }
    }, [courseCode, baseCode]);

    return (
        <BottomSheetView
            style={[
                {
                    paddingBottom: insets.bottom,
                },
                styles.container,
            ]}>
            <SelectItem
                items={courseLanguages
                    .map((lang) => ({
                        label: t(`languages.${lang.code}`),
                        value: lang.code,
                    }))
                    .filter((lang) => lang.value !== baseCode)}
                title={t("onboarding.i_want_to_learn")}
                onSelect={setCourseCode}
                selectedValue={courseCode}
            />
            <SelectItem
                items={courseLanguages
                    .map((lang) => ({
                        label: t(`languages.${lang.code}`),
                        value: lang.code,
                    }))
                    .filter((lang) => lang.value !== courseCode)}
                title={t("onboarding.i_speak")}
                onSelect={setBaseCode}
                selectedValue={baseCode}
            />
            <Button
                loading={loading}
                onPress={handlePress}
                style={{ marginTop: 4 }}>
                <ButtonText>{t("update")}</ButtonText>
            </Button>
        </BottomSheetView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        gap: 12,
    },
    selectItem: {
        paddingVertical: 4,
        gap: 8,
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectValue: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
});
