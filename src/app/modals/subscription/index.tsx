import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import BrandText from "@/components/ui/BrandText";
import Chip from "@/components/ui/chip/Chip";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import {
    Gem,
    Globe,
    MegaphoneOff,
    MessageCircle,
    Sparkles,
    X,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import Toast from "react-native-toast-message";

const icons = [Sparkles, Globe, MessageCircle];

export default function SubscriptionModal() {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const [buttonLoading, setButtonLoading] = useState(false);

    const basePaddingTop = 24;

    return (
        <>
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
            <ScrollView
                alwaysBounceVertical={false}
                contentContainerStyle={styles.container}
                style={{
                    backgroundColor: colors.background,
                    paddingTop: Platform.select({
                        android: insets.top + basePaddingTop,
                        ios: basePaddingTop,
                    }),
                    paddingBottom: insets.bottom,
                }}>
                <View>
                    <View style={styles.contentWrapper}>
                        <Chip>
                            <Gem size={16} color={colors.primary} />
                            <ThemedText
                                type="primary"
                                style={{
                                    fontSize: 12,
                                }}>
                                {t("subscription.name")}
                            </ThemedText>
                        </Chip>

                        <BrandText
                            large
                            style={{
                                marginTop: 16,
                            }}>
                            {t("subscription.title")}
                        </BrandText>
                        <ThemedText
                            type="secondary"
                            style={{
                                marginTop: 4,
                            }}>
                            {t("subscription.description")}
                        </ThemedText>

                        <View style={styles.itemsWrapper}>
                            {Array.from({ length: 3 }).map((_, index) => {
                                const Icon = icons[index];
                                return (
                                    <View
                                        style={styles.item}
                                        key={`${index}_item`}>
                                        <View
                                            style={[
                                                styles.icon,
                                                {
                                                    backgroundColor:
                                                        colors.primaryContainer,
                                                },
                                            ]}>
                                            <Icon
                                                size={24}
                                                color={colors.primary}
                                            />
                                        </View>
                                        <Markdown
                                            rules={{
                                                strong: (node) => (
                                                    <ThemedText
                                                        key={node.key}
                                                        type="defaultSemiBold">
                                                        {
                                                            node.children[0]
                                                                .content
                                                        }
                                                    </ThemedText>
                                                ),
                                            }}
                                            style={{
                                                body: {
                                                    ...styles.itemText,
                                                    color: colors.textSecondary,
                                                },
                                            }}>
                                            {t(
                                                `subscription.item_${index + 1}`
                                            )}
                                        </Markdown>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>
                <View style={styles.horizontalPadding}>
                    <Button
                        loading={buttonLoading}
                        onPress={async () => {
                            try {
                                setButtonLoading(true);
                                const result = await axios.post(
                                    "/v1/subscriptions"
                                );

                                if (!result.data.url) {
                                    Toast.show({
                                        type: "error",
                                        text1: t("errors.something_went_wrong"),
                                    });

                                    return;
                                }

                                router.dismiss();
                                router.push(
                                    `/subscribe?url=${encodeURIComponent(
                                        result.data.url
                                    )}`
                                );
                            } catch (error) {
                                console.error(error);
                                Toast.show({
                                    type: "error",
                                    text1: t("errors.something_went_wrong"),
                                });
                            } finally {
                                setButtonLoading(false);
                            }
                        }}>
                        <ButtonText>{t("subscription.cta")}</ButtonText>
                    </Button>
                    <ThemedText type="secondary" style={styles.disclaimer}>
                        {t("subscription.disclaimer")}
                    </ThemedText>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    horizontalPadding: {
        paddingHorizontal: 24,
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    disclaimer: {
        fontSize: 8,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 12,
    },
    contentWrapper: {
        paddingHorizontal: 24,
        paddingVertical: 20 + 24,
    },
    itemsWrapper: {
        marginTop: 16,
        gap: 4,
    },
    item: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 12,
    },
    icon: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    },
    itemText: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Montserrat_500Medium",
    },
});
