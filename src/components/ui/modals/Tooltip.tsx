import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface TooltipProps {
    children: React.ReactNode;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    content: React.ReactNode;
    position: string;
}

export default function Tooltip({
    children,
    visible,
    setVisible,
    content,
    position,
}: TooltipProps) {
    return (
        <>
            {children}
            {visible && (
                <Modal
                    transparent
                    visible={visible}
                    onRequestClose={() => setVisible(false)}>
                    <TouchableOpacity
                        touchSoundDisabled
                        style={styles.backdrop}
                        onPress={() => setVisible(false)}
                        activeOpacity={1}>
                        <View style={[styles.tooltip]}>{content}</View>
                    </TouchableOpacity>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
    },
    tooltip: {
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 6,
        maxWidth: "80%",
        elevation: 2,
    },
});
