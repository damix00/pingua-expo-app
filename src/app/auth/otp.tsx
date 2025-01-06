import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import {
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ONBOARDING_APPBAR_HEIGHT } from "../onboarding/OnboardingAppbar";
import { useTranslation } from "react-i18next";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import {
    router,
    useLocalSearchParams,
    useNavigation,
    useRootNavigation,
} from "expo-router";
import { useRef, useState } from "react";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import Toast from "react-native-toast-message";
import axios from "axios";
import { setJwt } from "@/api/data";
import { useAuth } from "@/context/AuthContext";
import { CommonActions } from "@react-navigation/native";
import { saveUserCache } from "@/utils/cache/user-cache";
import { usePopAllAndPush } from "@/hooks/navigation";

export default function AuthOtpPage() {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const { t } = useTranslation();
    const { email, ...params } = useLocalSearchParams();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const popAllAndPush = usePopAllAndPush();

    const verifyOtp = async (code: string) => {
        setLoading(true);

        try {
            const response = await axios.post("/v1/auth/email/verify", {
                email,
                code,
            });

            if (response.status == 200) {
                if (response.data.user) {
                    // User exists
                    setJwt(response.data.jwt);
                    auth.setUser(response.data.user);
                    auth.setLoggedIn(true);
                    auth.setCourses(response.data.courses);
                    auth.setSectionData(response.data.section_data);

                    await saveUserCache(
                        response.data.user,
                        response.data.jwt,
                        response.data.courses,
                        response.data.section_data
                    );

                    // Replace all routes with the home route
                    popAllAndPush("(tabs)");
                } else {
                    if (!params.code) {
                        // The user doesn't have an account but they think they do
                        // So we show them a screen informing them and then send them to onboarding

                        router.replace(
                            `/onboarding/no-account?email=${email}&otp=${response.data.id}`
                        );
                    } else {
                        popAllAndPush("auth/profile-setup", {
                            email,
                            otp: response.data.id,
                            ...params,
                        });
                    }
                }
            } else {
                Toast.show({
                    type: "error",
                    text1: t("errors.oh_no"),
                    text2: t("errors.wrong_otp"),
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: t("errors.oh_no"),
                text2: t("errors.otp_fail"),
            });
        }

        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={{
                backgroundColor: colors.background,
                flex: 1,
            }}
            behavior="padding">
            <View
                style={{
                    marginTop: insets.top + ONBOARDING_APPBAR_HEIGHT,
                    marginBottom: insets.bottom,
                    marginHorizontal: 24,
                }}>
                <ThemedText type="heading">{t("auth.otp_title")}</ThemedText>
                <ThemedText type="secondary" style={{ marginTop: 4 }}>
                    {t("auth.otp_description", {
                        email,
                    })}
                </ThemedText>

                <OtpInput
                    textInputProps={{
                        textContentType: "oneTimeCode",
                        autoComplete: "one-time-code",
                    }}
                    disabled={loading}
                    theme={{
                        pinCodeContainerStyle: {
                            height: 56,
                            width: 48,
                        },
                        pinCodeTextStyle: {
                            fontFamily: "Montserrat_600SemiBold",
                        },
                        containerStyle: {
                            marginTop: 24,
                            marginBottom: 32,
                        },
                    }}
                    focusColor={colors.primary}
                    numberOfDigits={6}
                    onTextChange={(text) => {
                        setOtp(text);

                        if (text.length === 6) {
                            Keyboard.dismiss();
                            verifyOtp(text);
                        }
                    }}
                />

                <Button
                    disabled={otp.length < 6}
                    loading={loading}
                    onPress={() => verifyOtp(otp)}>
                    <ButtonText>{t("auth.otp_button")}</ButtonText>
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}
