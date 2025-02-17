import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";

export default function Dashes({
    dashLength = 5, // Length of each dash segment
    dashThickness = 1, // Thickness of each dash segment
    dashGap = 3, // Gap between each dash
    dashColor = "black", // Color of the dash
    orientation = "horizontal", // 'horizontal' or 'vertical'
}) {
    const [dashCount, setDashCount] = useState(0);
    const isHorizontal = orientation === "horizontal";

    const handleLayout = useCallback((event: any) => {
        const { width, height } = event.nativeEvent.layout;
        const totalLength = isHorizontal ? width : height;

        // Calculate how many dashes fit in the available space.
        // We add dashGap so the last dash doesn't need an extra gap.
        const count = Math.floor(
            (totalLength + dashGap) / (dashLength + dashGap)
        );
        if (count !== dashCount) {
            setDashCount(count);
        }
    }, []);

    const dashes = useMemo(() => {
        const d = [];
        for (let i = 0; i < dashCount; i++) {
            d.push(
                <View
                    key={i}
                    style={{
                        backgroundColor: dashColor,
                        width: isHorizontal ? dashLength : dashThickness,
                        height: isHorizontal ? dashThickness : dashLength,
                        // Only add margin for all but the last dash
                        marginRight:
                            isHorizontal && i !== dashCount - 1 ? dashGap : 0,
                        marginBottom:
                            !isHorizontal && i !== dashCount - 1 ? dashGap : 0,
                    }}
                />
            );
        }
        return d;
    }, [dashCount, isHorizontal, dashColor]);

    return (
        <View
            onLayout={handleLayout}
            style={{
                flexDirection: isHorizontal ? "row" : "column",
                alignItems: "center",
            }}>
            {dashes}
        </View>
    );
}
