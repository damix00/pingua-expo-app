import { useThemeColors } from "@/hooks/useThemeColor";
import { BlurView, BlurViewProps } from "expo-blur";
import { forwardRef } from "react";
import { Platform, View } from "react-native";
import Animated from "react-native-reanimated";

const IosBlurView = forwardRef<
    View,
    BlurViewProps & {
        transparentBackgroundColor?: string;
    }
>(({ children, intensity, style, ...props }, ref: any) => {
    const colors = useThemeColors();

    if (Platform.OS === "android") {
        return (
            <View
                ref={ref}
                style={[{ backgroundColor: colors.background }, style]}
                {...props}>
                {children}
            </View>
        );
    }
    return (
        <BlurView
            ref={ref}
            style={[
                {
                    backgroundColor:
                        props.transparentBackgroundColor ??
                        colors.transparentBackground,
                },
                style,
            ]}
            intensity={intensity}
            {...props}>
            {children}
        </BlurView>
    );
});

export const AnimatedIosBlurView =
    Animated.createAnimatedComponent(IosBlurView);

export default IosBlurView;
