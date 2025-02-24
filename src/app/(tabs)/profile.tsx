import React from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { usePopAllAndPush } from "@/hooks/navigation";
import { clearUserCache } from "@/utils/cache/user-cache";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import { Gem, LogOut, SettingsIcon } from "lucide-react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

function Divider({
    style,
}: {
    style?: React.ComponentProps<typeof View>["style"];
}) {
    return <View style={[styles.divider, style]} />;
}

export default function ProfileTab() {
    const auth = useAuth();
    const insets = useAppbarSafeAreaInsets();
    const colors = useThemeColors();
    const { t } = useTranslation();

    const handleLogout = () => {
        Alert.alert(t("popups.logout.title"), t("popups.logout.description"), [
            {
                text: t("popups.logout.cancel"),
                style: "cancel",
            },
            {
                text: t("popups.logout.confirm"),
                onPress: () => {
                    clearUserCache();
                    auth.logout();
                    router.replace("/onboarding");
                },
                style: "destructive",
            },
        ]);
    };

    if (!auth.user) {
        return <></>;
    }

    const iconSize = 20;
    const iconColor = colors.text;

    return (
        <ScrollView
            alwaysBounceVertical={false}
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    backgroundColor: colors.background,
                },
            ]}>
            <View style={styles.userInfo}>
                <ThemedText type="heading">{auth.user.name}</ThemedText>
                <ThemedText type="secondary">@{auth.user.username}</ThemedText>
            </View>
            <View style={styles.items}>
                <Divider
                    style={{
                        marginHorizontal: 0,
                    }}
                />
                <ListButton
                    onPress={() => router.push("/modals/subscription")}
                    textColor={
                        auth.user.plan == "FREE" ? colors.primary : colors.text
                    }
                    text={
                        auth.user.plan == "FREE"
                            ? t("subscription.get_subscription")
                            : t("subscription.name")
                    }
                    icon={
                        <Gem
                            size={iconSize}
                            color={
                                auth.user.plan == "FREE"
                                    ? colors.primary
                                    : colors.text
                            }
                        />
                    }
                />
                <Divider />
                <ListButton
                    onPress={handleLogout}
                    text="Logout"
                    icon={<LogOut size={iconSize} color={iconColor} />}
                />
            </View>
        </ScrollView>
    );
}

const ListButton = ({
    onPress,
    text,
    textColor,
    icon,
}: {
    onPress: () => void;
    text: string;
    textColor?: string;
    icon: React.ReactNode;
}) => {
    return (
        <HapticTouchableOpacity style={styles.listButton} onPress={onPress}>
            {icon}
            <ThemedText
                style={[
                    styles.buttonText,
                    {
                        color: textColor,
                    },
                ]}>
                {text}
            </ThemedText>
        </HapticTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userInfo: {
        alignItems: "flex-start",
        paddingTop: 16,
        paddingBottom: 12,
        gap: 2,
        paddingHorizontal: 24,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
    },
    email: {
        fontSize: 18,
    },
    items: {
        gap: 0,
        paddingTop: 8,
    },
    listButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 8,
    },
    buttonText: {
        fontSize: 13,
    },
    divider: {
        marginHorizontal: 24,
        height: 1,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
});
