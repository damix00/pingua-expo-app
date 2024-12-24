import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import TextInput from "@/components/input/TextInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import React from "react";
import { Ref, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    StyleSheet,
    TextInput as RNTextInput,
    View,
    ScrollView,
} from "react-native";
import Autolink from "react-native-autolink";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileSetupPage() {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    return (
        <>
            <ScrollView
                contentInsetAdjustmentBehavior="never"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollViewContent}
                style={[
                    styles.scrollView,
                    {
                        backgroundColor: colors.background,
                        paddingTop: insets.top,
                    },
                ]}>
                <View>
                    <ThemedText type="heading">
                        {t("auth.profile_setup_title")}
                    </ThemedText>
                    <ThemedText type="secondary" style={{ marginTop: 4 }}>
                        {t("auth.profile_setup_description")}
                    </ThemedText>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            autoFocus
                            autoCapitalize="words"
                            textContentType="name"
                            title={t("name")}
                            placeholder="Fran Galović"
                        />
                        <TextInput
                            autoCapitalize="none"
                            title={t("username")}
                            placeholder="frang1"
                        />
                    </View>
                </View>
            </ScrollView>
            <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={-insets.bottom}
                style={[
                    styles.buttonWrapper,
                    {
                        paddingBottom: insets.bottom + 16,
                        backgroundColor: colors.background,
                    },
                ]}>
                <Button>
                    <ButtonText>{t("finish")}</ButtonText>
                </Button>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        height: "100%",
        paddingHorizontal: 24,
    },
    scrollViewContent: {
        flexGrow: 1,
        marginTop: 24,
        marginBottom: 48,
    },
    inputWrapper: {
        marginTop: 16,
        gap: 8,
    },
    buttonWrapper: {
        paddingHorizontal: 24,
        position: "fixed",
        bottom: 0,
    },
});
