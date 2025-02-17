import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { StyleSheet, TouchableHighlight, View } from "react-native";

export default function MenuBar({
    items,
    onClose,
    itemSize,
}: {
    items: {
        text: string;
        onPress?: () => any;
        isTitle?: boolean;
        icon?: React.ReactNode;
        isDestructive?: boolean;
        withSeparator?: boolean;
    }[];
    onClose: () => void;
    itemSize?: number;
}) {
    const colors = useThemeColors();

    return (
        <View
            style={[
                styles.menuBar,
                {
                    backgroundColor: colors.background,
                },
            ]}>
            {items.map((item, index) => (
                <TouchableHighlight
                    disabled={!item.onPress || item.isTitle}
                    underlayColor={colors.backgroundVariant}
                    style={{
                        borderTopRightRadius: index === 0 ? 8 : 0,
                        borderTopLeftRadius: index === 0 ? 8 : 0,
                        borderBottomRightRadius:
                            index === items.length - 1 ? 8 : 0,
                        borderBottomLeftRadius:
                            index === items.length - 1 ? 8 : 0,
                    }}
                    key={index}
                    onPress={() => {
                        item.onPress?.();
                        onClose();
                    }}>
                    <View
                        style={[
                            styles.item,
                            {
                                borderBottomWidth:
                                    item.withSeparator || item.isTitle ? 1 : 0,
                                borderBottomColor: colors.outline,
                                height: item.isTitle ? undefined : itemSize,
                                paddingVertical: item.isTitle ? 8 : undefined,
                            },
                        ]}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flex: 1,
                            }}>
                            <ThemedText
                                style={{
                                    color: item.isDestructive
                                        ? colors.error
                                        : item.isTitle
                                        ? colors.textSecondary
                                        : colors.text,
                                    flex: 1,
                                    textAlign: item.isTitle ? "center" : "left",
                                    fontSize: item.isTitle ? 12 : undefined,
                                }}>
                                {item.text}
                            </ThemedText>
                            {item.icon}
                        </View>
                    </View>
                </TouchableHighlight>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    menuBar: {
        borderRadius: 8,
        minWidth: 200,
        alignSelf: "center",
    },
    item: {
        padding: 12,
        flexDirection: "row",
    },
});
