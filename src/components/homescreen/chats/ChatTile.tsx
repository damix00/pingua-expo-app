import { ThemedText } from "@/components/ui/ThemedText";
import { useChat } from "@/context/ChatContext";
import { Character } from "@/types/course";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export interface ChatTileProps {
    character: Character;
    name: string;
    image: any;
}

const IMAGE_SIZE = 52;

export default function ChatTile({ name, image, character }: ChatTileProps) {
    const { t } = useTranslation();
    const chat = useChat(character);

    const exists = useMemo(() => chat != null, [chat]);
    const lastMessage = useMemo(() => chat?.lastMessage, [chat]);

    const handlePress = useCallback(() => {
        router.push(`/chats/${character}`);
    }, [character]);

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.item}>
                <View style={styles.imageParent}>
                    <Image source={image} style={styles.image} />
                </View>
                <View style={styles.itemText}>
                    <ThemedText fontWeight="700">{name}</ThemedText>
                    <ThemedText
                        type="secondary"
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
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 24,
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
        backgroundColor: "blue",
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
