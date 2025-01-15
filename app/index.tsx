import { Button, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import GridCarouselView from "@/components/GridCarouselView";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useEffect, useState } from "react";
import { useData } from "@/DataContext";
import GrantButtonView from "@/components/GrantButtonView";
import NewGrantCarouselView from "@/components/NewGrantCarouselView";

export default function Index() {
  const { signOut } = useAuthenticator();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{
          paddingRight: 10,
        }}>
          <Button
            onPress={signOut}
            title="Sign out"
          />
        </View>
      )
    });
  }, []);

  const [isNewGrantView, setIsNewGrantView] = useState<boolean>(true); // TODO: Start this as false.
  const [newGrantNumberToNewMap, setNewGrantNumberToNewMap] = useState<Map<number, boolean>>(new Map([[0, false], [10, true], [200, false], [350, true]]));
  const { numberToCountMap,  isLoading, refreshData } = useData();

  if (isLoading) {
      return (
          <View style={styles.container}>
              <ActivityIndicator size="large" color="#fff" />
          </View>
      );
  }

  if (isNewGrantView) {
    if (newGrantNumberToNewMap.size === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>No new numbers available</Text>
        </View>
      );
    }

    const newNumbers = Array.from(newGrantNumberToNewMap.keys());
    newNumbers.sort((a, b) => a - b);

    return (
      <View style={styles.container}>
        <NewGrantCarouselView numberToNewMap={newGrantNumberToNewMap} onBackToGrid={() => setIsNewGrantView(false)} />
      </View>
    )
  }

  async function handleGetNewNumbersPress() {
    // TODO: Make network call to get new numbers.
    // TODO: Set newGrantNumberToNewMap to the new numbers.
    // TODO: Call the function to refresh the data.
    await refreshData();
    setIsNewGrantView(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Number Collection</Text>
      <GridCarouselView numberToCount={numberToCountMap} />
      <GrantButtonView onGetNewNumbersPress={handleGetNewNumbersPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  header: {
    color: "#fff",
    fontSize: 24,
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});