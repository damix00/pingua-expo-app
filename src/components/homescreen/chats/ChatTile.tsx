import NativeTouchable from "@/components/input/button/NativeTouchable";
import SelectItem from "@/components/input/stateful/select/SelectItem";
import { ThemedText } from "@/components/ui/ThemedText";
import { chatCharacters, useChat, useChats } from "@/context/ChatContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Character } from "@/types/course";
import axios from "axios";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export interface ChatTileProps {
    character: Character;
    name: string;
    image: any;
}

const IMAGE_SIZE = 52;

export default function ChatTile({ name, image, character }: ChatTileProps) {
    const { t } = useTranslation();
    const chat = useChat(character);

    const chats = useChats();

    const exists = useMemo(() => chat != null, [chat]);
    const lastMessage = useMemo(() => chat?.lastMessage, [chat]);

    const colors = useThemeColors();

    const handlePress = useCallback(() => {
        router.push(`/chats/${encodeURIComponent(character)}`);
    }, [character]);

    const handleClear = useCallback(() => {
        Alert.alert(t("chats.clear"), t("chats.clearChatPrompt"), [
            {
                text: t("cancel"),
                style: "cancel",
            },
            {
                text: t("chats.clear"),
                style: "destructive",
                onPress: async () => {
                    const response = await axios.delete(
                        `/v1/chats/${chat?.id}`
                    );

                    if (response.status !== 200) {
                        Toast.show({
                            type: "error",
                            text1: t("errors.something_went_wrong"),
                        });
                    }

                    chats.updateChat({
                        id: chat?.id || "",
                        character,
                        messages: [],
                        memories: [],
                        lastMessage: null,
                    });
                },
            },
        ]);
    }, [character, chat]);

    const menuItems = useMemo(
        () => [
            {
                isTitle: true,
                text: name,
            },
            {
                isDestructive: true,
                text: t("chats.clear"),
                icon: <Trash2 size={18} color={colors.error} />,
                onPress: handleClear,
            },
        ],
        [name, t, colors, handleClear, chat]
    );

    return (
        <SelectItem items={menuItems}>
            <NativeTouchable onPress={handlePress}>
                <View
                    style={[
                        styles.item,
                        {
                            backgroundColor: colors.background,
                        },
                    ]}>
                    <View style={styles.imageParent}>
                        <Image
                            source={image}
                            style={[
                                styles.image,
                                {
                                    borderColor: colors.outline,
                                },
                            ]}
                        />
                    </View>
                    <View style={styles.itemText}>
                        <ThemedText fontWeight="700">{name}</ThemedText>
                        <ThemedText
                            type="secondary"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                fontSize: 12,
                            }}>
                            {exists && lastMessage
                                ? lastMessage.userMessage
                                    ? t("chats.youChat", {
                                          message: lastMessage.content,
                                      })
                                    : lastMessage.content
                                : t("chats.tapToChat")}
                        </ThemedText>
                    </View>
                </View>
            </NativeTouchable>
        </SelectItem>
    );
}

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 12,
        marginHorizontal: 12,
        borderRadius: 4,
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: IMAGE_SIZE,
        marginBottom: 8,
        borderWidth: 1,
        objectFit: "contain",
    },
    imageParent: {
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,
        alignSelf: "center",
    },
    itemText: {
        gap: 2,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
});
