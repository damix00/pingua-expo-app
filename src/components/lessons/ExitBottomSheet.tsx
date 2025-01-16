import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/ThemedText";
import { StyleSheet } from "react-native";
import Button from "../input/button/Button";
import ButtonText from "../input/button/ButtonText";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { router } from "expo-router";

export default function ExitBottomSheet() {
    const bottomSheet = useBottomSheet();
    const insets = useSafeAreaInsets();

    return (
        <BottomSheetView
            style={[
                {
                    paddingBottom: insets.bottom,
                },
                styles.content,
            ]}>
            <ThemedText>Pls dont exit bro</ThemedText>
            <Button
                onPress={() => {
                    bottomSheet.hideBottomSheet();
                    setTimeout(() => {
                        router.back();
                    }, 200);
                }}>
                <ButtonText>Exit (i dont like you)</ButtonText>
            </Button>
            <Button
                variant="text"
                onPress={() => {
                    bottomSheet.hideBottomSheet();
                }}>
                <ButtonText>Cancel</ButtonText>
            </Button>
        </BottomSheetView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
    },
});
