import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ThemedText } from "../../ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/hooks/useThemeColor";
import { CachedSvgUri } from "@/utils/cache/SVGCache";
import { findFlag } from "@/utils/i18n";
import { StyleSheet, View } from "react-native";
import Button from "../../input/button/Button";
import ButtonText from "../../input/button/ButtonText";
import { useBottomSheet } from "@/context/BottomSheetContext";

export default function CourseSelectSheet() {
    const auth = useAuth();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const colors = useThemeColors();
    const bottomSheet = useBottomSheet();

    const course = useMemo(() => {
        return auth.courses.find((c) => c.id === auth.selectedCourse);
    }, [auth.courses, auth.selectedCourse]);

    return (
        <BottomSheetView
            style={[
                {
                    paddingBottom: insets.bottom,
                },
                styles.container,
            ]}>
            <View style={styles.card}>
                <CachedSvgUri
                    width={44}
                    height={44}
                    uri={
                        findFlag(
                            course?.languageCode ?? auth.courses[0].languageCode
                        ) ?? ""
                    }
                />
                <ThemedText
                    style={{
                        flex: 1,
                    }}>
                    {t(`languages.currently_learning`, {
                        language: t(`languages.${course?.languageCode}`),
                        base: t(`languages.${course?.appLanguageCode}`),
                    })}
                </ThemedText>
            </View>
            <Button onPress={bottomSheet.hideBottomSheet}>
                <ButtonText>{t("change")}</ButtonText>
            </Button>
        </BottomSheetView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
});
