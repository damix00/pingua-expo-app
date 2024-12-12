import { TextProps, TouchableOpacity } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Href, router } from "expo-router";

export default function AppLinkText({
    href,
    ...props
}: TextProps & { href: Href }) {
    return (
        <TouchableOpacity
            onPress={(e) => {
                router.push(href as any);

                if (props.onPress) {
                    props.onPress(e);
                }
            }}>
            <ThemedText {...props} onPress={undefined}>
                {props.children}
            </ThemedText>
        </TouchableOpacity>
    );
}
