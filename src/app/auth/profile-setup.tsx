import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import TextInput from "@/components/input/TextInput";
import { ThemedText } from "@/components/ui/ThemedText";
import useHaptics from "@/hooks/useHaptics";
import { useThemeColors } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { Ref, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    StyleSheet,
    TextInput as RNTextInput,
    View,
    ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import axios from "axios";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import { setJwt } from "@/api/data";
import { saveUserCache } from "@/utils/cache/user-cache";
import { StatusBar } from "expo-status-bar";
import { CommonActions } from "@react-navigation/native";
import { usePopAllAndPush } from "@/hooks/navigation";

export default function ProfileSetupPage() {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const { t, i18n } = useTranslation();
    const haptics = useHaptics();
    const popAllAndPush = usePopAllAndPush();

    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const { email, otp, code, fluency, goal } = useLocalSearchParams();
    const auth = useAuth();

    return (
        <>
            <StatusBar style="dark" />
            <ScrollView
                contentInsetAdjustmentBehavior="never"
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
                            errorKey={nameError}
                            maxLength={128}
                            autoFocus
                            autoCapitalize="words"
                            textContentType="name"
                            title={t("name")}
                            onChangeText={(text) => setName(text)}
                            value={name}
                            placeholder="Fran Galović"
                        />
                        <TextInput
                            errorKey={usernameError}
                            errorParams={{ count: 3 }}
                            autoCapitalize="none"
                            maxLength={20}
                            title={t("username")}
                            placeholder="frang1"
                            onChangeText={(text) => {
                                setUsername(
                                    text
                                        .toLowerCase()
                                        .replaceAll(" ", "_")
                                        // Remove all non-alphanumeric characters, except periods, underscores and hyphens
                                        .replace(/[^a-z0-9._-]/g, "")
                                );
                            }}
                            value={username}
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
                    },
                ]}>
                <Button
                    loading={loading}
                    onPress={async () => {
                        const newName = name.trim();
                        setName(newName);

                        let error = false;

                        if (newName === "") {
                            error = true;
                            setNameError("errors.field_required");
                        } else {
                            setNameError("");
                        }

                        if (username === "") {
                            error = true;

                            setUsernameError("errors.field_required");
                        } else if (username.length < 3) {
                            error = true;

                            setUsernameError("errors.min_characters");
                        } else {
                            setUsernameError("");
                        }

                        if (error) {
                            await haptics.notificationAsync(
                                Haptics.NotificationFeedbackType.Error
                            );

                            return;
                        }

                        setLoading(true);

                        try {
                            // Simulate loading
                            const response = await axios.post(
                                "/v1/auth/register",
                                {
                                    email,
                                    code_id: otp,
                                    username,
                                    name: newName,
                                    app_locale: i18n.language,
                                    language_code: code,
                                    fluency_level: fluency,
                                    goal,
                                }
                            );

                            if (response.status == 201 && response.data.user) {
                                setJwt(response.data.jwt);
                                auth.setUser(response.data.user);
                                auth.setCourses(response.data.courses);
                                auth.setSectionData(response.data.section_data);

                                auth.setLoggedIn(true);

                                await saveUserCache({
                                    user: response.data.user,
                                    jwt: response.data.jwt,
                                    courses: response.data.courses,
                                    sectionData: response.data.section_data,
                                    selectedCourse: response.data.courses[0].id,
                                    chats: [],
                                });

                                popAllAndPush("(tabs)");
                            } else {
                                Toast.show({
                                    type: "error",
                                    text1: t("errors.oh_no"),
                                    text2: t("errors.something_went_wrong"),
                                });
                            }
                        } catch (e) {
                            console.error(e);

                            Toast.show({
                                type: "error",
                                text1: t("errors.oh_no"),
                                text2: t("errors.something_went_wrong"),
                            });
                        } finally {
                            setLoading(false);
                        }
                    }}>
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
