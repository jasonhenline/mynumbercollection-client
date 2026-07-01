import { ScrollView, View, StyleSheet } from "react-native";
import { useState, useMemo } from "react";
import {
    ActivityIndicator,
    Button,
    Menu,
    Text,
    TouchableRipple,
    ThemeProvider as PaperThemeOnlyProvider,
} from "react-native-paper";
import { useData } from "@/DataContext";
import { getGridColor } from "@/styles/getCardColor";
import { CollectionType, generateSequence, isInSequence } from "@/utils/math";
import { CustomDarkTheme } from "@/styles/customtheme";

const COLLECTION_LABELS: Record<CollectionType, string> = {
    fibonacci: "Fibonacci Sequence",
    squares: "Square Numbers",
    primes: "Prime Numbers",
    perfect: "Perfect Numbers",
    abundant: "Abundant Numbers",
    semiperfect: "Semiperfect Numbers",
    weird: "Weird Numbers",
    untouchable: "Untouchable Numbers",
};

const COLLECTION_TYPES = Object.keys(COLLECTION_LABELS) as CollectionType[];

export default function Collections() {
    const { numberToCountMap, isLoading } = useData();
    const darkTheme = CustomDarkTheme;
    const backgroundColor = darkTheme.colors.surface;
    const [selectedType, setSelectedType] = useState<CollectionType>("fibonacci");
    const [menuVisible, setMenuVisible] = useState(false);

    const collectedNumbers = useMemo(
        () => new Set<number>(numberToCountMap.keys()),
        [numberToCountMap],
    );

    const numbers = useMemo(() => {
        let maxInSequence = 0;
        let maxOverall = 0;
        for (const n of collectedNumbers) {
            if (n > maxOverall) maxOverall = n;
            if (n > maxInSequence && isInSequence(selectedType, n)) {
                maxInSequence = n;
            }
        }
        const bound = selectedType === "untouchable" ? maxOverall : maxInSequence;
        return generateSequence(selectedType, Math.max(bound, 1));
    }, [selectedType, collectedNumbers]);

    if (isLoading) {
        return (
            <PaperThemeOnlyProvider theme={darkTheme}>
                <View style={[styles.container, { backgroundColor }]}>
                    <ActivityIndicator size="large" />
                </View>
            </PaperThemeOnlyProvider>
        );
    }

    function getColors(number: number) {
        if (!collectedNumbers.has(number)) {
            return { backgroundColor: "#bbb", color: "#444" };
        }
        const { background, foreground } = getGridColor(number);
        return { backgroundColor: background, color: foreground };
    }

    const rows = [];
    for (let i = 0; i < numbers.length; i += 10) {
        const elements = [];
        for (let j = i; j < i + 10 && j < numbers.length; j++) {
            const number = numbers[j];
            const { backgroundColor, color } = getColors(number);
            const cellView = (
                <View
                    key={j}
                    style={{
                        ...styles.cell,
                        backgroundColor,
                    }}
                >
                    <Text
                        style={{
                            color,
                            fontWeight: "bold",
                            cursor: collectedNumbers.has(number)
                                ? undefined
                                : "default",
                        }}
                    >
                        {number}
                    </Text>
                </View>
            );

            if (collectedNumbers.has(number)) {
                elements.push(
                    <TouchableRipple key={j} onPress={() => {}}>
                        {cellView}
                    </TouchableRipple>,
                );
            } else {
                elements.push(cellView);
            }
        }
        rows.push(
            <View style={{ flexDirection: "row" }} key={i}>
                {elements}
            </View>,
        );
    }

    return (
        <PaperThemeOnlyProvider theme={darkTheme}>
            <ScrollView
                contentContainerStyle={[styles.container, { backgroundColor }]}
            >
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button
                            mode="outlined"
                            onPress={() => setMenuVisible(true)}
                            icon="filter-variant"
                        >
                            {COLLECTION_LABELS[selectedType]}
                        </Button>
                    }
                >
                    {COLLECTION_TYPES.map((type) => (
                        <Menu.Item
                            key={type}
                            title={COLLECTION_LABELS[type]}
                            onPress={() => {
                                setSelectedType(type);
                                setMenuVisible(false);
                            }}
                        />
                    ))}
                </Menu>
                <View style={styles.gridContainer}>{rows}</View>
            </ScrollView>
        </PaperThemeOnlyProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        paddingVertical: 20,
    },
    gridContainer: {
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
