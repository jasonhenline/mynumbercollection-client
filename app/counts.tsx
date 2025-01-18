import { useData } from "@/DataContext";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, DataTable } from "react-native-paper";

export default function Counts() {
  const { numberToCountMap,  isLoading } = useData();

  if (isLoading) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    )
  }

  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([5]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

  const sortedNumbers = Array.from(numberToCountMap).sort((a, b) => {
    if (a[1] !== b[1]) {
        return b[1] - a[1];
    }
    return b[0] - a[0];
  }).map(([number, _]) => number);

  const sortedByNumberAscItems =
    Array.from(numberToCountMap)
      .sort((a, b) => a[0] - b[0])
      .map(([number, count]) => {return {key: number, number,  count}});

  const sortedByNumberDescItems =
    Array.from(numberToCountMap)
      .sort((a, b) => b[0] - a[0])
      .map(([number, count]) => {return {key: number, number,  count}});

  const sortedByCountAscItems =
    Array.from(numberToCountMap)
      .sort((a, b) => a[1] - b[1])
      .map(([number, count]) => {return {key: number, number,  count}});

  const sortedByCountDescItems =
    Array.from(numberToCountMap)
      .sort((a, b) => b[1] - a[1])
      .map(([number, count]) => {return {key: number, number,  count}});

  const [sortCondition, setSortCondition] = useState<"numberAsc" | "numberDesc" | "countAsc" | "countDesc">("numberAsc");

  const [items, setItems] = useState(sortedByNumberAscItems);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    setPage(0)
  }, [itemsPerPage]);

  const numberSortDirection = sortCondition === "numberAsc" ? "ascending" : sortCondition === "numberDesc" ? "descending" : undefined;
  const countSortDirection = sortCondition === "countAsc" ? "ascending" : sortCondition === "countDesc" ? "descending" : undefined;

  function onNumberHeaderPress() {
    if (sortCondition === "numberAsc") {
      setSortCondition("numberDesc");
      setItems(sortedByNumberDescItems);
    } else {
      setSortCondition("numberAsc");
      setItems(sortedByNumberAscItems)
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
      <DataTable>
        <DataTable.Header>
          <DataTable.Title sortDirection={numberSortDirection} onPress={onNumberHeaderPress}>Number</DataTable.Title>
          <DataTable.Title sortDirection={countSortDirection} onPress={onCountHeaderPress}>Count</DataTable.Title>
        </DataTable.Header>

        {items.slice(from, to).map((item) => (
            <DataTable.Row key={item.key}>
              <DataTable.Cell>{item.number}</DataTable.Cell>
              <DataTable.Cell>{item.count}</DataTable.Cell>
            </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          //numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={5}
          //onItemsPerPageChange={onItemsPerPageChange}
          //showFastPaginationControls
          //selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});