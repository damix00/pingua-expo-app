import { Platform, View } from "react-native";
import {
    TouchableOpacity,
    TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { TouchableNativeFeedbackProps } from "react-native-gesture-handler/lib/typescript/components/touchables/TouchableNativeFeedbackProps";

export default function NativeTouchable(
    props: TouchableNativeFeedbackProps & {
        androidBorderRadius?: number;
    }
) {
    return Platform.OS == "ios" ? (
        <TouchableOpacity {...props} />
    ) : (
        <View
            style={{
                borderRadius:
                    Platform.OS == "android" ? props.androidBorderRadius : 0,
                overflow: "hidden",
            }}>
            <TouchableNativeFeedback {...props} />
        </View>
    );
}
