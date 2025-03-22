import { useBottomNavSafeAreaInsets } from "@/hooks/useAppbarSafeAreaInsets";
import { useThemeColors } from "@/hooks/useThemeColor";
import SkeletonLoading from "expo-skeleton-loading";
import { ScrollView, StyleSheet, View } from "react-native";

function SkeletonCard() {
    const colors = useThemeColors();

    const bgColor = colors.backgroundVariant;

    return (
        // @ts-ignore
        <SkeletonLoading
            background={bgColor}
            highlight={colors.backgroundHighlight}>
            <View
                style={{
                    width: 200,
                    height: 300,
                    borderRadius: 8,
                    backgroundColor: bgColor,
                }}
            />
        </SkeletonLoading>
    );
}

function GroupSkeleton() {
    const colors = useThemeColors();

    const bgColor = colors.backgroundVariant;

    return (
        // @ts-ignore
        <SkeletonLoading
            background={bgColor}
            highlight={colors.backgroundHighlight}>
            <View style={{ marginBottom: 16 }}>
                <View
                    style={{
                        width: 100,
                        height: 18,
                        backgroundColor: bgColor,
                        borderRadius: 10,
                        marginBottom: 8,
                        marginHorizontal: 16,
                    }}
                />

                <View
                    style={{
                        flexDirection: "row",
                        gap: 8,
                        paddingHorizontal: 16,
                    }}>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </View>
            </View>
        </SkeletonLoading>
    );
}

export default function ScenariosSkeleton() {
    const colors = useThemeColors();
    const insets = useBottomNavSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 24,
                    paddingBottom: insets.bottom + 24,
                    backgroundColor: colors.background,
                },
            ]}>
            <GroupSkeleton />
            <GroupSkeleton />
            <GroupSkeleton />
            <GroupSkeleton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
