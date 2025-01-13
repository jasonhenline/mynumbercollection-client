import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import GridCarouselView from "@/components/GridCarouselView";

export default function Index() {
  return (
    <View style={styles.container}>
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
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
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
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});