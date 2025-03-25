import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const blurHash = "LFCaGY%g%hxs0[R.IvRP?Jt7s:t7";

export default function ScenarioPageHeader({ imageUrl }: { imageUrl: string }) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.imageContainer,
                {
                    paddingTop: insets.top / 2,
                    backgroundColor: "black",
                },
            ]}>
            <Image
                placeholder={{ blurHash }}
                source={imageUrl}
                style={[
                    styles.image,
                    {
                        height: 200 + insets.top,
                    },
                ]}
            />
            <LinearGradient
                colors={["transparent", "black"]}
                style={[
                    styles.gradient,
                    {
                        top: insets.top / 2 - 1, // Prevents a line from appearing
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
    },
    imageContainer: {
        position: "relative",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "40%",
        transform: [
            {
                rotate: "180deg",
            },
        ],
    },
});
