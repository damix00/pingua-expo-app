import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedText } from "@/components/ui/ThemedText";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ONBOARDING_APPBAR_HEIGHT } from "../onboarding/OnboardingAppbar";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import TextInput from "@/components/input/TextInput";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Autolink from "react-native-autolink";
import { openBrowserAsync } from "expo-web-browser";

export default function Auth() {
    const colors = useThemeColors();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <>
            <StatusBar style="auto" />
            <KeyboardAwareScrollView
                enableOnAndroid
                contentInsetAdjustmentBehavior="never"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollViewContent}
                style={[
                    styles.scrollView,
                    {
                        backgroundColor: colors.background,
                        paddingTop: insets.top + ONBOARDING_APPBAR_HEIGHT,
                    },
                ]}>
                <View style={[styles.imageWrapper]}>
                    <Image
                        source={require("@/assets/images/icon.png")}
                        style={styles.image}
                    />
                </View>
                <View>
                    <ThemedText style={styles.heading} type="heading">
                        {t("auth.login")}
                    </ThemedText>
                    <TextInput
                        keyboardType="email-address"
                        returnKeyType="done"
                        textContentType="emailAddress"
                        title="Email"
                        placeholder="example@latinary.com"
                        style={{ marginBottom: 16 }}
                    />
                    <Button
                        onPress={() => {
                            Keyboard.dismiss();
                        }}>
                        <ButtonText>{t("continue")}</ButtonText>
                    </Button>
                    <Autolink
                        url
                        text={t("auth.disclaimer")}
                        component={ThemedText}
                        style={[
                            styles.disclaimer,
                            {
                                color: colors.textSecondary,
                            },
                        ]}
                        matchers={[
                            {
                                pattern: /<a\s+href="([^"]+)"\s*>(.*?)<\/a>/gi,
                                style: { color: colors.primary },
                                getLinkText: (replacerArgs) => replacerArgs[2],
                                onPress: async (match) => {
                                    // regex to get the href value
                                    const href = match
                                        .getMatchedText()
                                        .match(/href="([^"]+)"/);
                                    if (href) {
                                        // open the link in the browser
                                        await openBrowserAsync(href[1]);
                                    }
                                },
                            },
                        ]}
                    />
                </View>
            </KeyboardAwareScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 24,
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: "space-evenly",
    },
    heading: {
        textAlign: "center",
        marginBottom: 20,
    },
    imageWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        height: 128,
        objectFit: "contain",
    },
    disclaimer: {
        textAlign: "center",
        marginTop: 8,
        fontSize: 10,
    },
});
