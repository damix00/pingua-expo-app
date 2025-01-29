import ChatTile from "@/components/homescreen/chats/ChatTile";
import { ThemedView } from "@/components/ThemedView";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Character } from "@/types/course";
import {
    fujioAvatar,
    jaxonAvatar,
    saraAvatar,
} from "@/utils/cache/CachedImages";
import { FlatList, Platform, StyleSheet, View } from "react-native";

const chats: {
    character: Character;
    name: string;
    image: any;
}[] = [
    {
        character: Character.Fujio,
        name: "Fujio",
        image: fujioAvatar,
    },
    {
        character: Character.Jaxon,
        name: "Jaxon",
        image: jaxonAvatar,
    },
    {
        character: Character.Sara,
        name: "Sara",
        image: saraAvatar,
    },
];

export default function ChatsTab() {
    const colors = useThemeColors();
    const insets = useAppbarSafeAreaInsets();

    return (
        <ThemedView style={styles.container}>
            <FlatList
                style={[
                    styles.list,
                    {
                        paddingTop: insets.top + 12,
                        paddingBottom: insets.bottom,
                    },
                ]}
                contentContainerStyle={styles.contentContainer}
                data={chats}
                renderItem={({ item }) => <ChatTile {...item} />}
                keyExtractor={(item) => item.character}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    contentContainer: {
        gap: 4,
    },
});
