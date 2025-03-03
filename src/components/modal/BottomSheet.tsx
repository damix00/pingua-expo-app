import { useBoxShadow } from "@/hooks/useBoxShadow";
import { useThemeColors } from "@/hooks/useThemeColor";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useRef } from "react";
import {
    Dimensions,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

// Create an animated version of TouchableOpacity
const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

// Define the CustomBottomSheetModal component
const CustomBottomSheetModal = forwardRef(function CustomBottomSheetModal(
    {
        children,
    }: {
        children: React.ReactNode;
    },
    ref: React.ForwardedRef<BottomSheetModal<any>>
) {
    // Get theme colors
    const colors = useThemeColors();
    // Shared value for backdrop background color
    const backdropBackground = useSharedValue("#00000000");
    // Get box shadow style
    const shadow = useBoxShadow();

    // Animated style for the backdrop
    const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backdropBackground.value,
        };
    });

    return (
        <BottomSheetModal
            handleIndicatorStyle={{
                backgroundColor: colors.text,
            }}
            maxDynamicContentSize={Dimensions.get("window").height * 0.75}
            backgroundStyle={{
                backgroundColor: colors.background,
            }}
            style={shadow}
            // Custom backdrop component
            backdropComponent={(props) => (
                <AnimatedTouchableOpacity
                    {...props}
                    onPress={() => {
                        if (typeof ref === "object" && ref !== null) {
                            ref.current?.dismiss();
                        }
                    }}
                    activeOpacity={1}
                    style={[
                        bottomSheetAnimatedStyle,
                        {
                            flex: 1,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                        },
                    ]}
                />
            )}
            ref={ref}
            // Animate backdrop background color on modal animate
            onAnimate={(from, to) => {
                if (to == -1) {
                    backdropBackground.value = withTiming("#00000000");
                } else {
                    backdropBackground.value = withTiming(colors.backdrop);
                }
            }}>
            {children}
        </BottomSheetModal>
    );
});

export default CustomBottomSheetModal;
