import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/ThemedText";
import { Image, StyleSheet, View } from "react-native";
import Button from "../input/button/Button";
import ButtonText from "../input/button/ButtonText";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { router } from "expo-router";
import { mascotSad } from "@/utils/cache/CachedImages";
import { useTranslation } from "react-i18next";

export default function ExitBottomSheet() {
    const bottomSheet = useBottomSheet();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    return (
        <BottomSheetView
            style={[
                {
                    paddingBottom: insets.bottom + 16,
                },
                styles.content,
            ]}>
            <Image source={mascotSad} style={styles.image} />
            <View style={styles.textWrapper}>
                <ThemedText type="heading" style={styles.text}>
                    {t("lesson.modal.title")}
                </ThemedText>
                <ThemedText type="secondary" style={styles.text}>
                    {t("lesson.modal.subtitle")}
                </ThemedText>
            </View>
            <Button
                haptic={false}
                variant="text"
                style={{ marginBottom: 8 }}
                onPress={() => {
                    bottomSheet.hideBottomSheet();
                    setTimeout(() => {
                        router.back();
                    }, 200);
                }}>
                <ButtonText>{t("lesson.modal.exit")}</ButtonText>
            </Button>
            <Button
                onPress={() => {
                    bottomSheet.hideBottomSheet();
                }}>
                <ButtonText>{t("lesson.modal.cancel")}</ButtonText>
            </Button>
        </BottomSheetView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
    },
    image: {
        margin: 16,
        alignSelf: "center",
        objectFit: "contain",
        width: 128,
        height: 128,
    },
    text: {
        // textAlign: "center",
        textAlign: "left",
    },
    textWrapper: {
        gap: 4,
        marginBottom: 8,
    },
});
