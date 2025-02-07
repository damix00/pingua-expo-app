import { ThemedText } from "@/components/ui/ThemedText";
import { Message } from "@/context/ChatContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { HoldItem } from "@/lib/react-native-context-menu";
import { SendHorizonal } from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export default function ChatBubble({
    content,
    userMessage,
    loading,
}: {
    content: string;
    userMessage: boolean;
    loading?: boolean;
}) {
    const colors = useThemeColors();
    const offset = useSharedValue(0);

    useEffect(() => {
        if (loading) {
            offset.value = withRepeat(
                withSequence(
                    withTiming(2, { duration: 500 }),
                    withTiming(0, { duration: 500 })
                ),
                100
            );
        }
    }, []);

    return (
        <HoldItem
            closeOnTap
            items={[
                {
                    text: "Actions",
                    icon: "home",
                    isTitle: true,
                    onPress: () => {},
                },
                { text: "Action 1", icon: "edit", onPress: () => {} },
                {
                    text: "Action 2",
                    icon: "map-pin",
                    withSeparator: true,
                    onPress: () => {},
                },
                {
                    text: "Action 3",
                    icon: "trash",
                    isDestructive: true,
                    onPress: () => {},
                },
            ]}>
            <View
                style={[
                    styles.parent,
                    {
                        alignSelf: userMessage ? "flex-end" : "flex-start",
                    },
                ]}>
                <View
                    style={[
                        styles.bubble,
                        {
                            backgroundColor: userMessage
                                ? colors.primary
                                : colors.card,
                            opacity: loading ? 0.5 : 1,
                        },
                    ]}>
                    <ThemedText type={userMessage ? "onPrimary" : undefined}>
                        {content}
                    </ThemedText>
                </View>
                <Animated.View
                    style={{
                        transform: [{ translateY: offset }],
                    }}>
                    {loading && (
                        <SendHorizonal
                            color={colors.textSecondary}
                            size={16}
                            style={styles.sendingIndicator}
                        />
                    )}
                </Animated.View>
            </View>
        </HoldItem>
    );
}

const styles = StyleSheet.create({
    parent: {
        flexDirection: "row",
        alignItems: "flex-end",
        maxWidth: "80%",
    },
    sendingIndicator: {
        marginBottom: 4,
        marginLeft: 4,
    },
    bubble: {
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
});
