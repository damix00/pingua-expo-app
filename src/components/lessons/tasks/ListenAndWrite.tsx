import { Question } from "@/types/course";
import { View } from "react-native";
import { TaskTitle } from "./task";
import { useTranslation } from "react-i18next";
import AudioButton from "@/components/input/button/AudioButton";
import { StyleSheet } from "react-native";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import Animated from "react-native-reanimated";
import { ThemedText } from "@/components/ui/ThemedText";
import TextInput from "@/components/input/TextInput";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";

export default function ListenAndWriteTask({
    data,
    onComplete,
}: {
    data: Question;
    onComplete: (mistake: boolean) => any;
}) {
    const { t } = useTranslation();
    const keyboardHeight = useKeyboardHeight(false);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingBottom: keyboardHeight,
                },
            ]}>
            <View>
                <ThemedText fontWeight="800" style={styles.titleText}>
                    {t("lesson.questions.listen_and_write")}
                </ThemedText>
                <View style={styles.task}>
                    <AudioButton audioUri={data.audio} />
                    <TextInput
                        containerStyle={{ flex: 1 }}
                        placeholder={t("lesson.questions.write_here")}
                    />
                </View>
            </View>
            <View style={styles.buttonWrapper}>
                <Button variant="text">
                    <ButtonText>{t("lesson.questions.cant_listen")}</ButtonText>
                </Button>
                <Button>
                    <ButtonText>{t("continue")}</ButtonText>
                </Button>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    titleText: {
        textAlign: "center",
        fontSize: 20,
    },
    task: {
        marginTop: 16,
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonWrapper: {
        flexDirection: "column",
        gap: 4,
    },
});
