import { Button, Text, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useData } from "@/DataContext";

export default function Counts() {
  const { numberToCountMap,  isLoading } = useData();

  if (isLoading) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#fff" />
        </View>
    )
  }

  const sortedNumbers = Array.from(numberToCountMap).sort((a, b) => {
    if (a[1] !== b[1]) {
        return b[1] - a[1];
    }
    return b[0] - a[0];
  }).map(([number, _]) => number);

  const rows = sortedNumbers.map((number) => (
    <View key={number} style={styles.row}>
        <View style={styles.rowView}>
            <Text style={styles.text}>{number}</Text>
        </View>
        <View style={styles.rowView}>
            <Text style={styles.text}>{numberToCountMap.get(number)}</Text>
        </View>
    </View>
  ));

  return (
    <View style={styles.container}>
        <View style={styles.row}>
            <View style={styles.rowView}>
                <Text style={styles.tableHeader}>Number</Text>
            </View>
            <View style={styles.rowView}>
                <Text style={styles.tableHeader}>Count</Text>
            </View>
        </View>
        <ScrollView>
            {rows}
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#fff",
    textAlign: "right",
    padding: 5,
  },
  tableHeader: {
    color: '#fff',
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
  },
  rowView: {
    width: 120,
  }
});