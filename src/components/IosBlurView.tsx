import { BlurView, BlurViewProps } from "expo-blur";
import { forwardRef } from "react";
import { Platform, View } from "react-native";

const IosBlurView = forwardRef<View, BlurViewProps>(
    ({ children, intensity, ...props }, ref: any) => {
        if (Platform.OS === "android") {
            return (
                <View ref={ref} {...props}>
                    {children}
                </View>
            );
        }
        return (
            <BlurView ref={ref} intensity={intensity} {...props}>
                {children}
            </BlurView>
        );
    }
);

export default IosBlurView;
