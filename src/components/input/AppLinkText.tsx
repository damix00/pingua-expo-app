import { StyleSheet, TextProps, TouchableOpacity } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Href, router } from "expo-router";

export default function AppLinkText({
    href,
    ...props
}: TextProps & { href: Href }) {
    return (
        <TouchableOpacity
            style={style.container}
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

const style = StyleSheet.create({
    container: {
        padding: 8,
    },
});
