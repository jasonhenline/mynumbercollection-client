import { Button, Text, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useData } from "@/DataContext";
import { Grant } from "@/model/Grant";

export default function Grants() {
    const { grants, isLoading } = useData();

    if (isLoading) {
      return (
          <View style={styles.container}>
              <ActivityIndicator size="large" color="#fff" />
          </View>
      )
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

    const reversedGrants = [...grants].reverse();

    const rows = reversedGrants.map((grant) => (
      <View key={grant.timestamp.toString()} style={styles.row}>
          <View style={styles.rowView}>
              <Text style={styles.text}>{grant.timestamp.toLocaleString()}</Text>
          </View>
          <View style={styles.rowView}>
              <Text style={styles.text}>{getGrantString(grant)}</Text>
          </View>
      </View>
    ));

    return (
        <View style={styles.container}>
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
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#fff",
    textAlign: "right",
    padding: 5,
  },
  tableHeader: {
    color: '#fff',
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
  },
  rowView: {
    flex: 1,
  }
});