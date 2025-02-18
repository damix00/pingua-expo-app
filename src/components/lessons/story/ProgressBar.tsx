import { useThemeColors } from "@/hooks/useThemeColor";
import { useEffect } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
    AnimatedStyle,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

export default function ProgressBar({
    progress,
    style,
    containerStyle,
}: {
    progress: number;
    style?: Animated.View["props"]["style"];
    containerStyle?: Animated.View["props"]["style"];
}) {
    const colors = useThemeColors();

    const animatedProgress = useSharedValue(progress);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            easing: Easing.out(Easing.exp),
            duration: 500,
        });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${animatedProgress.value}%`,
    }));

    return (
        <View style={[styles.container, containerStyle]}>
            <Animated.View
                style={[
                    styles.progressContainer,
                    style,
                    {
                        backgroundColor: colors.primaryContainer,
                    },
                ]}>
                <Animated.View
                    style={[
                        styles.progress,
                        animatedStyle,
                        style,
                        {
                            backgroundColor: colors.primary,
                        },
                    ]}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 24,
    },
    progressContainer: {
        width: "100%",
        height: 8,
        borderRadius: 4,
    },
    progress: {
        height: "100%",
        borderRadius: 4,
    },
});
