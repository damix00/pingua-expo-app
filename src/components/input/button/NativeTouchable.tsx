import { Platform } from "react-native";
import {
    TouchableOpacity,
    TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { TouchableNativeFeedbackProps } from "react-native-gesture-handler/lib/typescript/components/touchables/TouchableNativeFeedbackProps";

export default function NativeTouchable(props: TouchableNativeFeedbackProps) {
    return Platform.OS == "ios" ? (
        <TouchableOpacity {...props} />
    ) : (
        <TouchableNativeFeedback {...props} />
    );
}
