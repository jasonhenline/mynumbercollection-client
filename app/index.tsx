import { Button, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import GridCarouselView from "@/components/GridCarouselView";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useEffect } from "react";
import { useData } from "@/DataContext";
import GrantButtonView from "@/components/GrantButtonView";

export default function Index() {
  const { user, signOut } = useAuthenticator();
  const navigation = useNavigation();

  // This is how to get the ID of the authenticated user.
  user.userId;

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

  const {numberToCountMap, grants, nextGrantTimestamp, isLoading, error, refreshData} = useData();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Number Collection</Text>
      <GridCarouselView numberToCount={numberToCountMap} />
      <GrantButtonView />
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