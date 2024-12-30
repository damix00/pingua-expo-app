import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import { ThemedText } from "@/components/ui/ThemedText";
import { Image, Keyboard, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ONBOARDING_APPBAR_HEIGHT } from "../onboarding/OnboardingAppbar";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import TextInput from "@/components/input/TextInput";
import React, { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Autolink from "react-native-autolink";
import { openBrowserAsync } from "expo-web-browser";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useVideoPlayer, VideoView } from "expo-video";
import { mascot } from "@/utils/cache/CachedImages";
import { router, useLocalSearchParams } from "expo-router";
import useHaptics from "@/hooks/useHaptics";
import * as Haptics from "expo-haptics";
import useUnmountSignal from "use-unmount-signal";

export default function Auth() {
    const colors = useThemeColors();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const email = useRef("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const haptics = useHaptics();
    const unmountSignal = useUnmountSignal();

    const { code, fluency, goal } = useLocalSearchParams();

    return (
        <>
            <StatusBar style="auto" />
            <KeyboardAwareScrollView
                alwaysBounceVertical={false}
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
                    <Image source={mascot} style={styles.image} />
                </View>
                <View>
                    <ThemedText style={styles.heading} type="heading">
                        {t("auth.login")}
                    </ThemedText>
                    <TextInput
                        autoCorrect={false}
                        spellCheck={false}
                        autoCapitalize="none"
                        autoComplete="email"
                        errorKey={emailError}
                        keyboardType="email-address"
                        returnKeyType="done"
                        textContentType="emailAddress"
                        title={t("email")}
                        placeholder="example@latinary.com"
                        onChangeText={(text) => {
                            email.current = text;
                        }}
                        style={{ marginBottom: 16 }}
                    />
                    <Button
                        loading={loading}
                        haptic={false}
                        onPress={async () => {
                            Keyboard.dismiss();

                            if (email.current == "") {
                                await haptics.notificationAsync(
                                    Haptics.NotificationFeedbackType.Error
                                );

                                setEmailError("errors.email_empty");
                                return;
                            }

                            if (!email.current.includes("@")) {
                                await haptics.notificationAsync(
                                    Haptics.NotificationFeedbackType.Error
                                );

                                setEmailError("errors.email_invalid");
                                return;
                            }

                            setLoading(true);

                            setEmailError("");

                            try {
                                const result = await axios.post(
                                    "/v1/auth/email/send-code",
                                    {
                                        email: email.current,
                                    },
                                    {
                                        signal: unmountSignal,
                                    }
                                );

                                if (result.status == 200) {
                                    await haptics.notificationAsync(
                                        Haptics.NotificationFeedbackType.Success
                                    );

                                    if (!code) {
                                        router.push(
                                            `/auth/otp?email=${email.current}`
                                        );
                                    } else {
                                        router.push(
                                            `/auth/otp?email=${email.current}&code=${code}&fluency=${fluency}&goal=${goal}`
                                        );
                                    }
                                } else {
                                    await haptics.notificationAsync(
                                        Haptics.NotificationFeedbackType.Error
                                    );

                                    Toast.show({
                                        type: "error",
                                        text1: t("errors.oh_no"),
                                        text2: t("errors.email_sending_fail"),
                                    });
                                }
                            } catch (e) {
                                await haptics.notificationAsync(
                                    Haptics.NotificationFeedbackType.Error
                                );

                                Toast.show({
                                    type: "error",
                                    text1: t("errors.oh_no"),
                                    text2: t("errors.email_sending_fail"),
                                });
                            } finally {
                                setLoading(false);
                            }
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
        height: 256,
        objectFit: "contain",
    },
    disclaimer: {
        textAlign: "center",
        marginTop: 8,
        fontSize: 10,
    },
});
