import ChatTile from "@/components/homescreen/chats/ChatTile";
import { ThemedView } from "@/components/ThemedView";
import Paywall from "@/components/ui/Paywall";
import { useAuth } from "@/context/AuthContext";
import { chats, useChats } from "@/context/ChatContext";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ChatsTab() {
    const colors = useThemeColors();
    const insets = useAppbarSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const chatsData = useChats();
    const auth = useAuth();

    // Force a re-render when the user navigates back to this screen
    // Because all the chat data is stored in the context.
    const isFocused = useIsFocused();

    const isPremium = useMemo(() => auth.user?.plan != "FREE", [auth.user]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            const data = await axios.get("/v1/chats");

            if (data.status == 200) {
                console.log("Refreshed chats data");
                chatsData.setChats(data.data.chats);
            }
        } finally {
            setRefreshing(false);
        }
    }, []);

    return (
        <ThemedView style={styles.container}>
            {!isPremium && <Paywall />}
            <View
                style={styles.list}
                pointerEvents={isPremium ? "auto" : "none"}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.primary}
                            progressViewOffset={insets.top}
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                        />
                    }
                    style={[
                        styles.list,
                        {
                            paddingTop: insets.top + 16,
                            paddingBottom: insets.bottom,
                        },
                    ]}
                    contentContainerStyle={styles.contentContainer}
                    data={chats}
                    renderItem={({ item }) => <ChatTile {...item} />}
                    keyExtractor={(item) => item.character}
                />
            </View>
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
