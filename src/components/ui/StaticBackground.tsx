import { useThemeColors } from "@/hooks/useThemeColor";
import {
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    View,
} from "react-native";
import { auraBg, staticBg } from "@/utils/cache/CachedImages";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function StaticBackground({
    children,
    showAura = true,
}: {
    children?: React.ReactNode;
    showAura?: boolean;
}) {
    const colors = useThemeColors();

    return (
        <>
            <StatusBar style="light" />
            <View
                style={[styles.container, { backgroundColor: colors.primary }]}>
                {showAura && (
                    <Image
                        resizeMode="cover"
                        style={[styles.aura]}
                        source={auraBg}
                    />
                )}

                <Image
                    resizeMode="repeat"
                    style={styles.static}
                    source={staticBg}
                />

                {children}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    static: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    aura: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        opacity: 0.25,
    },
});
