import { Button, Text, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useData } from "@/DataContext";
import { Grant } from "@/model/Grant";
import { DataTable } from "react-native-paper";
import { useEffect, useState } from "react";

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

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([5]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const sortedGrants = [...grants].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const [items] = useState(sortedGrants.map(grant => { return {key: grant.timestamp.toISOString(), time: grant.timestamp.toLocaleString(), numbers: getGrantString(grant)}}));

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    useEffect(() => {
      setPage(0)
    }, [itemsPerPage]);

    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title sortDirection={"descending"}>Time</DataTable.Title>
          <DataTable.Title>Numbers</DataTable.Title>
        </DataTable.Header>

        {items.slice(from, to).map((item) => (
            <DataTable.Row key={item.key}>
              <DataTable.Cell>{item.time}</DataTable.Cell>
              <DataTable.Cell textStyle={{fontSize: 9}}>{item.numbers}</DataTable.Cell>
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
    );

    // const reversedGrants = [...grants].reverse();

    // const rows = reversedGrants.map((grant) => (
    //   <View key={grant.timestamp.toString()} style={styles.row}>
    //       <View style={styles.rowView}>
    //           <Text style={styles.text}>{grant.timestamp.toLocaleString()}</Text>
    //       </View>
    //       <View style={styles.rowView}>
    //           <Text style={styles.text}>{getGrantString(grant)}</Text>
    //       </View>
    //   </View>
    // ));

    // return (
    //     <View style={styles.container}>
    //         <ScrollView>
    //             {rows}
    //         </ScrollView>
    //     </View>
    // )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
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