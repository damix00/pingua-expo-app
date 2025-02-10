import IosBlurView from "@/components/IosBlurView";
import { ThemedText } from "@/components/ui/ThemedText";
import { chatCharacters } from "@/context/ChatContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { getPlatformHeaderHeight } from "@/utils/util";
import { router, useGlobalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatHeader() {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const { character } = useGlobalSearchParams<{
        character: string;
    }>();

    const charData = chatCharacters[character as keyof typeof chatCharacters];

    if (!charData) {
        return null;
    }

    return (
        <IosBlurView
            style={{
                paddingTop: insets.top,
                borderBottomWidth: 1,
                borderBottomColor: colors.outline,
                // backgroundColor: "transparent",
            }}>
            <View style={styles.headerInner}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        router.back();
                    }}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Image source={charData.image} style={styles.avatar} />
                <ThemedText fontWeight="700" style={styles.name}>
                    {charData.name}
                </ThemedText>
            </View>
        </IosBlurView>
    );
}

const styles = StyleSheet.create({
    headerInner: {
        height: Platform.select({
            ios: 44,
            android: 56,
        }),
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
    },
    backButton: {
        padding: 8,
        paddingRight: 4,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 16,
        marginRight: 8,
    },
    name: {
        fontSize: 16,
    },
});
