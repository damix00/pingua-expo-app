import IosBlurView from "@/components/IosBlurView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useBoxShadow } from "@/hooks/useBoxShadow";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useRef, useState } from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const TRIANGLE_SIZE = 8;

export default function DialogueTranslation({
    translation,
    children,
}: {
    translation: string;
    children: React.ReactNode;
}) {
    const [y, setY] = useState(0);
    const [visible, setVisible] = useState(false);
    const triggerRef = useRef<View>(null);
    const colors = useThemeColors();
    const shadow = useBoxShadow();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                ref={triggerRef}
                onPress={(e) => {
                    setVisible(true);
                    triggerRef.current?.measure(
                        (fx, fy, width, height, px, py) => {
                            let y = py + height + 4;
                            const windowHeight =
                                Dimensions.get("window").height;

                            if (y + 100 > windowHeight) {
                                y = py - height - 4;
                            }

                            setY(y);
                        }
                    );
                }}>
                {children}
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent
                visible={visible}
                onRequestClose={() => setVisible(false)}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}>
                    <View style={styles.modalContainer}>
                        <IosBlurView
                            style={[
                                styles.triangle,
                                {
                                    top: y,
                                    borderBottomColor: colors.backgroundVariant,
                                },
                            ]}
                            intensity={15}
                        />
                        <IosBlurView
                            intensity={15}
                            style={[styles.modal, { top: y + TRIANGLE_SIZE }]}>
                            <ThemedText>{translation}</ThemedText>
                        </IosBlurView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
    },
    modal: {
        position: "absolute",
        left: 0,
        right: 0,
        padding: 12,
        marginHorizontal: 24,
        borderRadius: 8,
        overflow: "hidden",
    },
    backdrop: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    triangle: {
        position: "absolute",
        borderLeftWidth: TRIANGLE_SIZE,
        borderRightWidth: TRIANGLE_SIZE,
        borderBottomWidth: TRIANGLE_SIZE,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
    },
});
