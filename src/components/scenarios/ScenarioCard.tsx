import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { router } from "expo-router";
import { AIScenario } from "@/context/ScenariosContext";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function ScenarioCard({ data }: { data: AIScenario }) {
    const colors = useThemeColors();

    return (
        <TouchableOpacity
            delayPressIn={50}
            onPress={() => {
                router.push(`/scenarios/${data.id}`);
            }}>
            <View
                style={[
                    styles.container,
                    {
                        borderColor: colors.outline,
                    },
                ]}>
                <Image
                    source={data.imageUrl}
                    placeholder={{ blurhash }}
                    style={styles.image}
                />
                <View
                    style={[
                        styles.textWrapper,
                        {
                            borderColor: colors.outline,
                        },
                    ]}>
                    <ThemedText textBreakStrategy="simple">
                        {data.title}
                    </ThemedText>
                    <ThemedText
                        numberOfLines={4}
                        style={styles.description}
                        type="secondary"
                        ellipsizeMode="tail">
                        {data.description}
                    </ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: 200,
        height: 300,
        borderWidth: 1,
        borderRadius: 8,
    },
    description: {
        fontSize: 12,
    },
    image: {
        width: "100%",
        flex: 1,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
    },
    textWrapper: {
        padding: 10,
        gap: 2,
        borderTopWidth: 1,
    },
});
