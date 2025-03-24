import { AIScenario } from "@/context/ScenariosContext";
import { getPlatformHeaderHeight } from "@/utils/util";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/ThemedText";
import IosBlurView from "../IosBlurView";
import { useThemeColors } from "@/hooks/useThemeColor";
import NativeTouchable from "../input/button/NativeTouchable";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function ScenarioHeader(props: AIScenario) {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();

    return (
        <IosBlurView
            style={[
                {
                    paddingTop: insets.top,
                    borderBottomColor: colors.outline,
                    borderBottomWidth: 1,
                },
                styles.container,
            ]}>
            <View style={styles.containerInner}>
                <NativeTouchable onPress={() => router.back()}>
                    <View style={{ padding: 8 }}>
                        <ChevronLeft size={24} color={colors.text} />
                    </View>
                </NativeTouchable>
                <ThemedText
                    numberOfLines={1}
                    style={{ flex: 1, paddingRight: 8 }}>
                    {props.title}
                </ThemedText>
            </View>
        </IosBlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        zIndex: 10,
    },
    containerInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        height: getPlatformHeaderHeight(),
        flex: 1,
    },
});
