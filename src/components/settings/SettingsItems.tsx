import { Platform, StyleSheet, Switch, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { ChevronDown } from "lucide-react-native";
import OverlayDropdown from "../input/stateful/OverlayDropdown";

export function SettingsItem({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.item}>
            <ThemedText>{title}</ThemedText>
            {children}
        </View>
    );
}

export function SettingsCheckboxItem({
    title,
    checked,
    onChange,
}: {
    title: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    const colors = useThemeColors();

    return (
        <SettingsItem title={title}>
            <Switch
                style={{
                    marginVertical: Platform.select({
                        android: -16,
                        ios: -4,
                    }),
                }}
                trackColor={{
                    false: colors.backgroundDarker,
                    true:
                        Platform.OS == "android"
                            ? colors.primaryContainer
                            : colors.primary,
                }}
                thumbColor={Platform.OS == "ios" ? undefined : colors.primary}
                value={checked}
                onValueChange={onChange}
            />
        </SettingsItem>
    );
}

export function SettingsDropdownItem({
    title,
    items,
    selectedValue,
    onSelect,
}: {
    title: string;
    items: { label: string; value: string }[];
    selectedValue: string;
    onSelect: (value: string) => void;
}) {
    const colors = useThemeColors();

    return (
        <SettingsItem title={title}>
            <OverlayDropdown
                padding={{
                    right: 16,
                }}
                items={items}
                selectedValue={selectedValue}
                onSelect={onSelect}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                    }}>
                    <ThemedText>
                        {
                            items.find((item) => item.value === selectedValue)
                                ?.label
                        }
                    </ThemedText>
                    <ChevronDown size={16} color={colors.text} />
                </View>
            </OverlayDropdown>
        </SettingsItem>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
