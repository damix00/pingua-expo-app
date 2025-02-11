import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useCallback, useState, useRef, useEffect } from "react";
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    Pressable,
    Dimensions,
    ScrollView,
    Platform,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import IosBlurView, { AnimatedIosBlurView } from "@/components/IosBlurView";
import Animated, {
    Easing,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { Check } from "lucide-react-native";

interface OverlayDropdownProps {
    items: {
        label: string;
        value: string;
        icon?: React.ReactNode | ((props: { size: number }) => React.ReactNode);
    }[];
    onSelect: (value: string) => void;
    selectedValue: string;
    children: React.ReactNode;
}

export default function OverlayDropdown({
    items,
    onSelect,
    selectedValue,
    children,
}: OverlayDropdownProps) {
    const colors = useThemeColors();
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<"above" | "below">(
        "below"
    );
    const scale = useSharedValue(0);
    const [left, setLeft] = useState(0);
    const [dropdownTop, setDropdownTop] = useState(0);
    const triggerRef = useRef<View>(null);
    const insets = useSafeAreaInsets();

    const handleSelect = useCallback(
        (value: string) => {
            onSelect(value);
            setShowDropdown(false);
        },
        [onSelect]
    );

    useEffect(() => {
        scale.value = withTiming(showDropdown ? 1 : 0, {
            duration: 150,
            easing: showDropdown
                ? Easing.out(Easing.exp)
                : Easing.in(Easing.exp),
        });
    }, [showDropdown]);

    const handlePress = () => {
        if (triggerRef.current) {
            triggerRef.current.measure((fx, fy, width, height, px, py) => {
                const screenHeight = Dimensions.get("window").height;
                const dropdownHeight = Math.min(items.length * 48, 200); // Approximate height of dropdown items with a max height
                const spaceBelow = screenHeight - py - height - insets.bottom;
                const spaceAbove = py - insets.top;
                const left = px;

                if (
                    spaceBelow < dropdownHeight &&
                    spaceAbove > dropdownHeight
                ) {
                    setDropdownPosition("above");
                    setDropdownTop(py - dropdownHeight);
                } else {
                    setDropdownPosition("below");
                    setDropdownTop(py + height);
                }

                setLeft(left);

                setShowDropdown(true);
            });
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity ref={triggerRef} onPress={handlePress}>
                {children}
            </TouchableOpacity>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showDropdown}
                onRequestClose={() => setShowDropdown(false)}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => setShowDropdown(false)}>
                    <AnimatedIosBlurView
                        intensity={50}
                        style={[
                            styles.overlay,
                            {
                                transform: [
                                    {
                                        scale,
                                    },
                                ],
                                top: dropdownTop,
                                maxHeight: 200,
                                left,
                                backgroundColor:
                                    Platform.OS == "ios"
                                        ? colors.transparentBackground
                                        : colors.background,
                            },
                        ]}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            alwaysBounceVertical={false}
                            data={items}
                            keyExtractor={(item) => item.value}
                            contentInset={{
                                top: 4,
                                bottom: 4,
                            }}
                            ItemSeparatorComponent={() => (
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: colors.outline,
                                    }}
                                />
                            )}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    key={item.value}
                                    style={styles.item}
                                    onPress={() => handleSelect(item.value)}>
                                    {typeof item.icon === "function"
                                        ? item.icon({ size: 24 })
                                        : item.icon}
                                    <ThemedText>{item.label}</ThemedText>
                                    {item.value === selectedValue && (
                                        <Check
                                            size={16}
                                            color={colors.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </AnimatedIosBlurView>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    backdrop: {
        flex: 1,
    },
    overlay: {
        overflow: "hidden",
        position: "absolute",
        minWidth: 256,
        maxWidth: Dimensions.get("window").width * 0.8,
        borderRadius: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
