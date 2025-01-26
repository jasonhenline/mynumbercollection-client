import { useData } from "@/DataContext";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, DataTable, Text } from "react-native-paper";

export default function Counts() {
    const { numberToCountMap, isLoading } = useData();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const [page, setPage] = useState(0);

    const minimumAllowedRows = 3;
    const [itemsPerPage, setItemsPerPage] = useState(minimumAllowedRows);

    const sortedNumbers = Array.from(numberToCountMap)
        .sort((a, b) => {
            if (a[1] !== b[1]) {
                return b[1] - a[1];
            }
            return b[0] - a[0];
        })
        .map(([number, _]) => number);

    const sortedByNumberAscItems = Array.from(numberToCountMap)
        .sort((a, b) => a[0] - b[0])
        .map(([number, count]) => {
            return { key: number, number, count };
        });

    const sortedByNumberDescItems = Array.from(numberToCountMap)
        .sort((a, b) => b[0] - a[0])
        .map(([number, count]) => {
            return { key: number, number, count };
        });

    const sortedByCountAscItems = Array.from(numberToCountMap)
        .sort((a, b) => a[1] - b[1])
        .map(([number, count]) => {
            return { key: number, number, count };
        });

    const sortedByCountDescItems = Array.from(numberToCountMap)
        .sort((a, b) => b[1] - a[1])
        .map(([number, count]) => {
            return { key: number, number, count };
        });

    const [sortCondition, setSortCondition] = useState<
        "numberAsc" | "numberDesc" | "countAsc" | "countDesc"
    >("numberAsc");

    const [items, setItems] = useState(sortedByNumberAscItems);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const numberSortDirection =
        sortCondition === "numberAsc"
            ? "ascending"
            : sortCondition === "numberDesc"
              ? "descending"
              : undefined;
    const countSortDirection =
        sortCondition === "countAsc"
            ? "ascending"
            : sortCondition === "countDesc"
              ? "descending"
              : undefined;

    function onNumberHeaderPress() {
        if (sortCondition === "numberAsc") {
            setSortCondition("numberDesc");
            setItems(sortedByNumberDescItems);
        } else {
            setSortCondition("numberAsc");
            setItems(sortedByNumberAscItems);
        }
    }

    function onCountHeaderPress() {
        if (sortCondition === "countAsc") {
            setSortCondition("countDesc");
            setItems(sortedByCountDescItems);
        } else {
            setSortCondition("countAsc");
            setItems(sortedByCountAscItems);
        }
    }

    return (
        <DataTable
            style={{ flexGrow: 1, maxHeight: "100%" }}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;

                // During tab transitions, the height briefly flickers to zero which can set bad state.
                // We just ignore zero-height layouts to sidestep this issue.
                if (height <= 0) {
                    return;
                }

                // This calculation is only safe because every row (including the header and footer)
                // is constrained to a height of 48. We subtract 2 rows to account for the header and footer.
                const calculatedRowsPerPage =
                    Math.floor(height / styles.constrainHeight.maxHeight) - 2;

                // We take the max of the calculation and minimumAllowedRows as a failsafe against edge cases
                // with vanishingly small screens.
                setItemsPerPage(
                    Math.max(minimumAllowedRows, calculatedRowsPerPage),
                );
            }}
        >
            <DataTable.Header style={styles.constrainHeight}>
                <DataTable.Title
                    sortDirection={numberSortDirection}
                    onPress={onNumberHeaderPress}
                >
                    Number
                </DataTable.Title>
                <DataTable.Title
                    sortDirection={countSortDirection}
                    onPress={onCountHeaderPress}
                >
                    Count
                </DataTable.Title>
            </DataTable.Header>

            {items.slice(from, to).map((item) => (
                <DataTable.Row key={item.key} style={styles.constrainHeight}>
                    <DataTable.Cell>
                        <Text>{item.number}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                        <Text>{item.count}</Text>
                    </DataTable.Cell>
                </DataTable.Row>
            ))}

            <DataTable.Pagination
                style={styles.constrainHeight}
                page={page}
                numberOfPages={Math.ceil(items.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${items.length}`}
                numberOfItemsPerPage={itemsPerPage}
            />
        </DataTable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    constrainHeight: {
        maxHeight: 48,
    },
});
