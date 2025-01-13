import { Button, Text, View, StyleSheet } from "react-native";
import { Link, useNavigation } from "expo-router";
import GridCarouselView from "@/components/GridCarouselView";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useEffect } from "react";

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
    })
  })

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Number Collection</Text>
      <GridCarouselView
        numberToCount={
          new Map(
            [
              [3, 4],
              [8, 1],
              [16, 2],
              [34, 1],
              [102, 2],
              [199, 1],
            ])
        }
      ></GridCarouselView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
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