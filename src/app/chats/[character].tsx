import MessageInput from "@/components/homescreen/chats/MessageInput";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import useAppbarSafeAreaInsets from "@/hooks/useAppbarSafeAreaInsets";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    LinearTransition,
    useAnimatedStyle,
} from "react-native-reanimated";

export default function ChatScreen() {
    const colors = useThemeColors();
    const { character } = useLocalSearchParams<{
        character: string;
    }>();

    const [messages, setMessages] = useState<
        {
            id: string;
            content: string;
        }[]
    >([]);

    const keyboardHeight = useKeyboardHeight();
    const insets = useAppbarSafeAreaInsets();

    const animatedListPadding = useAnimatedStyle(
        () => ({
            // Padding top because the list is inverted
            paddingTop: keyboardHeight.value + insets.bottom + 24 + 8,
        }),
        [keyboardHeight, insets]
    );

    return (
        <View
            style={[
                styles.page,
                {
                    backgroundColor: colors.background,
                },
            ]}>
            <Animated.FlatList
                inverted
                contentInset={{ bottom: insets.top }}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                style={[styles.list, animatedListPadding]}
                data={messages}
                numColumns={1}
                renderItem={({ item }) => (
                    <Animated.View
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: colors.primary,
                        }}>
                        <ThemedText type="onPrimary">{item.content}</ThemedText>
                    </Animated.View>
                )}
                itemLayoutAnimation={LinearTransition}
                initialScrollIndex={0}
                keyExtractor={(item, index) => item.id}
            />
            <View style={styles.input}>
                <MessageInput
                    onSend={(message) => {
                        setMessages((prev) => [
                            {
                                id: Math.random().toString(),
                                content: message,
                            },
                            ...prev,
                        ]);
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    list: {
        flex: 1,
        paddingHorizontal: 16,
    },
    input: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        zIndex: 1,
    },
    contentContainer: {
        gap: 8,
    },
});
