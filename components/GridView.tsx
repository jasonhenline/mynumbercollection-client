import { getCardColor, getGridColor } from "@/styles/getCardColor";
import { View, StyleSheet } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
type GridViewProps = {
    numberToCount: Map<number, number>;
    startNumber: number;
    pressedCardInGrid: (card: number) => void;
};

export default function GridView(props: GridViewProps) {
    const numberSet = new Set<number>(props.numberToCount.keys());

    // The below colors are not themed, because they are a core part of
    // the existing visual identity of the app.
    function getColors(number: number) {
        if (!numberSet.has(number)) {
            return { backgroundColor: "#bbb", color: "#333" };
        }
        // Get the colors for this number from its rarity
        const { background, foreground } = getGridColor(number);
        return { backgroundColor: background, color: foreground };
    }

    const rows = [];
    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
        const elements = [];
        for (let colIndex = 0; colIndex < 10; colIndex++) {
            const number = props.startNumber + rowIndex * 10 + colIndex;
            const { backgroundColor, color } = getColors(number);
            elements.push(
                <TouchableRipple
                    onPress={() => {
                        props.pressedCardInGrid(number);
                    }}
                >
                    <View
                        key={colIndex}
                        style={{
                            ...styles.cell,
                            backgroundColor,
                        }}
                    >
                        <Text
                            style={{
                                color,
                                fontWeight: numberSet.has(number)
                                    ? "bold"
                                    : 100,
                            }}
                        >
                            {number}
                        </Text>
                    </View>
                </TouchableRipple>,
            );
        }
        const row = (
            <View style={{ flexDirection: "row" }} key={rowIndex}>
                {elements}
            </View>
        );
        rows.push(row);
    }

    return <View style={styles.container}>{rows}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cell: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
});
