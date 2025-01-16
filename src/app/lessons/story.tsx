import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { DialogueLine, Story } from "@/types/course";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { Easing, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Button from "@/components/input/button/Button";
import ButtonText from "@/components/input/button/ButtonText";
import IosBlurView from "@/components/IosBlurView";
import StoryProgressBar from "@/components/lessons/story/StoryProgressBar";
import { X } from "lucide-react-native";
import { useBottomSheet } from "@/context/BottomSheetContext";
import ExitBottomSheet from "@/components/lessons/ExitBottomSheet";

const AnimatedIosBlurView = Animated.createAnimatedComponent(IosBlurView);
const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

export default function StoryLessonScreen() {
    const { data } = useLocalSearchParams<{
        data: string;
    }>();
    const { t } = useTranslation();
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const [lines, setLines] = useState<DialogueLine[]>([]);
    const listRef = useRef<FlatList<DialogueLine>>(null);
    const bottomSheet = useBottomSheet();

    const scrollY = useSharedValue(0);
    const MIN_HEIGHT = 64 + insets.top;
    const MAX_HEIGHT = 180;

    const animatedHeaderStyle = useAnimatedStyle(() => ({
        height: interpolate(
            scrollY.value,
            [0, 100],
            [MAX_HEIGHT, MIN_HEIGHT],
            Extrapolation.CLAMP
        ),
        gap: interpolate(scrollY.value, [0, 100], [16, 8], Extrapolation.CLAMP),
    }));

    const animatedListStyle = useAnimatedStyle(
        () => ({
            paddingTop: interpolate(
                scrollY.value,
                [0, 100],
                [MAX_HEIGHT, MIN_HEIGHT + 100],
                Extrapolation.CLAMP
            ),
        }),
        [insets.top]
    );

    const animatedHeaderTextStyle = useAnimatedStyle(() => ({
        fontSize: interpolate(
            scrollY.value,
            [0, 100],
            [24, 18],
            Extrapolation.CLAMP
        ),
    }));

    const progressBarStyle = useAnimatedStyle(() => ({
        height: interpolate(
            scrollY.value,
            [0, 100],
            [8, 4],
            Extrapolation.CLAMP
        ),
    }));

    const parsed = useMemo(() => JSON.parse(data || "") as Story, [data]);

    if (!data || !parsed) {
        return (
            <ThemedView>
                <ThemedText>{t("errors.something_went_wrong")}</ThemedText>
            </ThemedView>
        );
    }

    useEffect(() => {
        if (lines.length == 0) {
            setLines(parsed.dialogue.slice(0, 1));
        }
    }, [parsed]);

    return (
        <View
            style={[
                {
                    backgroundColor: colors.background,
                },
                styles.screen,
            ]}>
            <AnimatedIosBlurView
                intensity={24}
                style={[
                    styles.header,
                    animatedHeaderStyle,
                    {
                        paddingTop: insets.top,
                        borderBottomColor: colors.outline,
                        backgroundColor:
                            Platform.OS == "ios"
                                ? colors.transparentBackground
                                : colors.background,
                    },
                ]}>
                <View style={styles.headerTop}>
                    <AnimatedThemedText
                        fontWeight="800"
                        style={[animatedHeaderTextStyle, styles.headerText]}>
                        {parsed.title}
                    </AnimatedThemedText>
                    <TouchableOpacity
                        onPress={() => {
                            bottomSheet.setBottomSheet(<ExitBottomSheet />);
                        }}
                        style={{
                            paddingHorizontal: 24,
                        }}>
                        <X size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <StoryProgressBar
                    style={progressBarStyle}
                    progress={(lines.length / parsed.dialogue.length) * 100}
                />
            </AnimatedIosBlurView>
            <Animated.FlatList
                ref={listRef}
                showsVerticalScrollIndicator={false}
                style={[animatedListStyle]}
                contentContainerStyle={{
                    marginBottom: insets.bottom + 64,
                }}
                onScroll={(e) => {
                    scrollY.value = e.nativeEvent.contentOffset.y;
                }}
                data={lines}
                keyExtractor={(item) => item.text}
                renderItem={({ item }) => (
                    <View style={styles.item} key={item.id}>
                        <ThemedText>{item.text}</ThemedText>
                    </View>
                )}
            />
            <View
                style={[
                    styles.buttonWrapper,
                    {
                        bottom: insets.bottom + 12,
                    },
                ]}>
                <Button
                    style={[styles.button]}
                    onPress={() => {
                        setLines((prev) => {
                            const len = prev.length;

                            return parsed.dialogue.slice(0, len + 1);
                        });
                    }}>
                    <ButtonText>{t("lesson.story.continue")}</ButtonText>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        zIndex: 100,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
    },
    headerText: {
        textAlign: "left",
        width: "100%",
        flex: 1,
        paddingHorizontal: 24,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    item: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
    },
    buttonWrapper: {
        position: "absolute",
        width: "100%",
        paddingHorizontal: 24,
    },
    button: {
        width: "100%",
    },
});
