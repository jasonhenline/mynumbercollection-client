import { Text, View, StyleSheet } from "react-native";

type GridViewProps = {
    numberToCount: Map<number, number>;
    startNumber: number;
}

export default function GridView(props: GridViewProps) {
    const numberSet = new Set<number>(props.numberToCount.keys());
    const rows = [];
    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
        const elements = [];
        for (let colIndex = 0; colIndex < 10; colIndex++) {
            const number = props.startNumber + rowIndex * 10 + colIndex;
            const backgroundColor = numberSet.has(number) ? "green" : "#bbb";
            const color = numberSet.has(number) ? "white" : "gray";
            elements.push(
                <View
                    key={colIndex}
                    style={{
                        ...styles.cell,
                        backgroundColor,
                    }}
                >
                    <Text style={{color}}>{number}</Text>
                </View>
            );
        }
        const row = (
            <View
                style={{ flexDirection: "row" }}
                key={rowIndex}
            >
                {elements}
            </View>
        );
        rows.push(row);
    }

    return (
        <View style={styles.container}>
            {rows}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#fff",
    },
    cell: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    }
});