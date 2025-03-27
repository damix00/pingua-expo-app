import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StreakSheet() {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const auth = useAuth();

    return (
        <BottomSheetView
            style={{
                paddingBottom: insets.bottom,
            }}>
            <ThemedText type="subtitle" style={styles.title}>
                {t("streak.title")}
            </ThemedText>
            <View style={styles.streakContainer}>
                {(auth.user?.streak?.current ?? 0) > 0 ? (
                    <>
                        <ThemedText
                            style={[
                                styles.streakText,
                                {
                                    fontSize: 16,
                                    marginBottom: 2,
                                },
                            ]}>
                            {t("streak.current", {
                                count: auth.user?.streak?.current ?? 0,
                            })}
                        </ThemedText>
                        <ThemedText
                            type="secondary"
                            style={[
                                styles.streakText,
                                {
                                    fontSize: 12,
                                },
                            ]}>
                            {t("streak.longest", {
                                count: auth.user?.streak?.longest ?? 0,
                            })}
                        </ThemedText>
                    </>
                ) : (
                    <ThemedText type="secondary" style={styles.noStreak}>
                        {t("streak.noStreak")}
                    </ThemedText>
                )}
            </View>
        </BottomSheetView>
    );
}

const styles = StyleSheet.create({
    title: {
        justifyContent: "center",
        alignItems: "center",
        fontSize: 16,
        textAlign: "center",
    },
    streakContainer: {
        marginTop: 8,
        paddingHorizontal: 16,
    },
    streakText: {
        textAlign: "center",
    },
    noStreak: {
        textAlign: "center",
        fontSize: 12,
    },
});
