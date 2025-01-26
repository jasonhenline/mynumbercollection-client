import { View, StyleSheet } from "react-native";
import { useData } from "@/DataContext";
import { Grant } from "@/model/Grant";
import { ActivityIndicator, DataTable, Text } from "react-native-paper";
import { useEffect, useState } from "react";

export default function Grants() {
    const { grants, isLoading } = useData();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" style={{ paddingTop: 32 }} />
            </View>
        );
    }

    function getGrantString(grant: Grant) {
        const numbers: number[] = [];
        for (const [number, count] of grant.numberToCountMap) {
            for (let i = 0; i < count; i++) {
                numbers.push(number);
            }
        }
        numbers.sort((a, b) => a - b);
        return numbers.join(", ");
    }

    const [page, setPage] = useState(0);

    const minimumAllowedRows = 3;
    const [itemsPerPage, setItemsPerPage] = useState(minimumAllowedRows);

    const sortedGrants = [...grants].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );

    const [items] = useState(
        sortedGrants.map((grant) => {
            return {
                key: grant.timestamp.toISOString(),
                time: grant.timestamp.toLocaleString(),
                numbers: getGrantString(grant),
            };
        }),
    );

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

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
                    style={styles.dateColumn}
                    sortDirection={"descending"}
                >
                    Time
                </DataTable.Title>
                <DataTable.Title style={styles.numberColumn}>
                    Numbers
                </DataTable.Title>
            </DataTable.Header>

            {items.slice(from, to).map((item) => (
                <DataTable.Row key={item.key} style={styles.constrainHeight}>
                    <DataTable.Cell style={styles.dateColumn}>
                        <Text numberOfLines={2}>{item.time}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.numberColumn}>
                        <Text numberOfLines={2}>{item.numbers}</Text>
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
    },
    dateColumn: {
        flexShrink: 2,
    },
    numberColumn: {
        flexShrink: 0,
        flexGrow: 2,
        paddingLeft: 16,
        minWidth: 150,
    },
    constrainHeight: {
        maxHeight: 48,
    },
});
