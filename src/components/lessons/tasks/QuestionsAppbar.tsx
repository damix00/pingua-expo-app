import { ThemedText } from "@/components/ui/ThemedText";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ExitBottomSheet from "../ExitBottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColor";
import { X } from "lucide-react-native";
import ProgressBar from "../story/ProgressBar";

const appbarHeight = 56;

export default function QuestionsAppbar({ progress }: { progress: number }) {
    const bottomSheet = useBottomSheet();
    const safeAreaInsets = useSafeAreaInsets();
    const colors = useThemeColors();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    height: appbarHeight + safeAreaInsets.top,
                    borderBottomColor: colors.outline,
                },
            ]}>
            <View
                style={[
                    styles.progressBarWrapper,
                    {
                        marginTop: safeAreaInsets.top,
                    },
                ]}>
                <ProgressBar
                    progress={progress * 100}
                    style={styles.progressBar}
                    containerStyle={{
                        paddingHorizontal: 0,
                        paddingLeft: 24,
                    }}
                />
            </View>
            <TouchableOpacity
                onPress={() => {
                    bottomSheet.setBottomSheet(<ExitBottomSheet />);
                }}
                style={[
                    styles.button,
                    {
                        marginTop: safeAreaInsets.top,
                    },
                ]}>
                <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        position: "absolute",
        top: 0,
        zIndex: 100,
        borderBottomWidth: 1,
    },
    button: {
        paddingHorizontal: 24,
    },
    progressBar: {
        height: 8,
        paddingHorizontal: 0,
    },
    progressBarWrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});
