import HapticTouchableOpacity from "@/components/input/button/HapticTouchableOpacity";
import TextInput from "@/components/input/TextInput";
import { AnimatedIosBlurView } from "@/components/IosBlurView";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { useThemeColors } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useState } from "react";
import {
    Keyboard,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export default function MessageInput({
    onSend,
}: {
    onSend: (message: string) => void;
}) {
    const [message, setMessage] = useState("");
    const colors = useThemeColors();
    const keyboardHeight = useKeyboardHeight();

    const animatedStyle = useAnimatedStyle(() => ({
        paddingBottom: keyboardHeight.value + 8,
    }));

    const sendMessage = useCallback(() => {
        setMessage("");
        onSend(message);
    }, [message]);

    return (
        <AnimatedIosBlurView style={[styles.container, animatedStyle]}>
            <TextInput
                highlightOnFocus={false}
                containerStyle={{ flex: 1 }}
                placeholder="Type a message"
                value={message}
                onChangeText={setMessage}
                submitBehavior="submit" // Don't hide keyboard on submit
                style={[
                    styles.input,
                    {
                        borderColor: colors.outline,
                    },
                ]}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
            />
            <HapticTouchableOpacity onPress={sendMessage}>
                <Ionicons name="send" size={24} color={colors.primary} />
            </HapticTouchableOpacity>
        </AnimatedIosBlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 8,
        height: 36,
        fontSize: 13,
        marginRight: 8,
        fontFamily:
            Platform.OS == "android" ? "Montserrat_500Medium" : undefined,
    },
});
