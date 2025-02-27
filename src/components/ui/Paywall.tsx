import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/hooks/useThemeColor";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import Button from "../input/button/Button";
import ButtonText from "../input/button/ButtonText";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

export default function Paywall() {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const insets = useAppbarSafeAreaInsets();

    return (
        <BlurView
            experimentalBlurMethod="dimezisBlurView"
            style={[
                styles.wrapper,
                {
                    backgroundColor: colors.transparentBackground,
                },
            ]}>
            <ScrollView
                alwaysBounceVertical={false}
                contentContainerStyle={[
                    styles.container,
                    {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom + 56 + 16,
                    },
                ]}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        gap: 4,
                    }}>
                    <ThemedText type="heading">{t("paywall.title")}</ThemedText>
                    <ThemedText type="secondary">
                        {t("paywall.description")}
                    </ThemedText>
                </View>
                <Button onPress={() => router.push("/modals/subscription")}>
                    <ButtonText>{t("paywall.subscribe")}</ButtonText>
                </Button>
            </ScrollView>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: "absolute",
        top: 0,
        zIndex: 1,
        height: "100%",
        width: "100%",
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        gap: 16,
    },
});
