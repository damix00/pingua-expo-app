import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewProps,
} from "react-native";
import CheckboxRadial from "../input/stateful/CheckboxRadial";
import { BlurView } from "expo-blur";

type GlassCardProps = {
    elevation?: "0" | "1" | "2" | "3" | "4" | "5";
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    contentPadding?: number;
    onPress?: () => any;
} & ViewProps;

function InnerGlassCard({
    children,
    elevation = "1",
    leading,
    trailing,
    contentPadding = 12,
    onPress,
    ...props
}: GlassCardProps) {
    // 2024 and Android still doesn't have good blur support...
    if (Platform.OS == "android") {
        return (
            <View
                {...props}
                style={[styles.blurWrapper, styles.container, props.style]}>
                {leading}
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: contentPadding,
                    }}>
                    {children}
                </View>
                {trailing}
            </View>
        );
    }

    // Works well on iOS, the blurWrapper had to be separated from the container
    // because the boxShadow was buggy
    return (
        <BlurView intensity={8} style={styles.blurWrapper}>
            <View {...props} style={[styles.container, props.style]}>
                {leading}
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: contentPadding,
                    }}>
                    {children}
                </View>
                {trailing}
            </View>
        </BlurView>
    );
}

export default function GlassCard({
    children,
    onPress,
    ...props
}: GlassCardProps) {
    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                <InnerGlassCard {...props}>{children}</InnerGlassCard>
            </TouchableOpacity>
        );
    }

    return <InnerGlassCard {...props}>{children}</InnerGlassCard>;
}

const styles = StyleSheet.create({
    blurWrapper: {
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
    },
    container: {
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        padding: 12,
        paddingHorizontal: 8,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});

export function GlassCardSelection({
    onSelect,
    selected,
    elevation = "1",
    isTrailing = true,
    ...props
}: GlassCardProps & {
    onSelect: (value: boolean) => any;
    selected: boolean;
    isTrailing?: boolean;
}) {
    return (
        <GlassCard
            onPress={() => onSelect(!selected)}
            {...props}
            elevation={elevation}
            style={[
                selected && [
                    elevation == "1" && {
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                    },
                ],
                props.style,
            ]}
            leading={
                !isTrailing ? (
                    <CheckboxRadial
                        borderVariant={
                            elevation == "1" ? "onPrimary" : "onBackground"
                        }
                        selected={selected}
                    />
                ) : (
                    props.leading
                )
            }
            trailing={
                isTrailing ? (
                    <CheckboxRadial
                        borderVariant={
                            elevation == "1" ? "onPrimary" : "onBackground"
                        }
                        selected={selected}
                    />
                ) : (
                    props.trailing
                )
            }
        />
    );
}
