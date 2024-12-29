import { BlurView, BlurViewProps } from "expo-blur";
import { Platform, View } from "react-native";

export default function IosBlurView({
    children,
    intensity,
    ...props
}: BlurViewProps) {
    if (Platform.OS == "android") {
        return <View {...props}>{children}</View>;
    }

    return <BlurView intensity={intensity} {...props} />;
}
