import { Button, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import GridCarouselView from "@/components/GridCarouselView";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useEffect, useState } from "react";
import { useData } from "@/DataContext";
import GrantButtonView from "@/components/GrantButtonView";
import NewGrantCarouselView from "@/components/NewGrantCarouselView";
import createApiClient from "@/clients/apiClient";

export default function Index() {
  const { signOut } = useAuthenticator();
  const navigation = useNavigation();
  const { user } = useAuthenticator();

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

  const [isNewGrantView, setIsNewGrantView] = useState<boolean>(false);
  const [newNumbers, setNewNumbers] = useState<{number: number, isNew: boolean}[]>([]);
  const { numberToCountMap,  isLoading, refreshData } = useData();

  if (isLoading) {
      return (
          <View style={styles.container}>
              <ActivityIndicator size="large" color="#fff" />
          </View>
      );
  }

  if (isNewGrantView) {
    if (newNumbers.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>No new numbers available</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <NewGrantCarouselView newNumbers={newNumbers} onBackToGrid={() => setIsNewGrantView(false)} />
      </View>
    )
  }

  async function handleGetNewNumbersPress() {
    const oldNumbers = new Set<number>([...numberToCountMap.keys()]);
    const apiClient = await createApiClient()
    const fetchedNumbers = await apiClient.fetchNewNumbers(user.userId);
    const newNumbersValue: {number: number, isNew: boolean}[] = [];
    for (const [n, c] of fetchedNumbers.entries()) {
      const isNew = !oldNumbers.has(n);
      for (let i = 0; i < c; i++) {
        newNumbersValue.push({number: n, isNew});
      }
    }
    setNewNumbers(newNumbersValue);
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