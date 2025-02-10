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

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

const CustomBottomSheetModal = forwardRef(function CustomBottomSheetModal(
    {
        children,
    }: {
        children: React.ReactNode;
    },
    ref: React.ForwardedRef<BottomSheetModal<any>>
) {
    const colors = useThemeColors();
    const backdropBackground = useSharedValue("#00000000");
    const scheme = useColorScheme();

    const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: backdropBackground.value,
        };
    });

    return (
        <BottomSheetModal
            maxDynamicContentSize={Dimensions.get("window").height * 0.75}
            backgroundStyle={{
                backgroundColor: colors.background,
            }}
            style={
                scheme == "light" && {
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.36,
                    shadowRadius: 6.68,
                }
            }
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
