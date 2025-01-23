import { View, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import GridCarouselView from "@/components/GridCarouselView";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useEffect, useState } from "react";
import { useData } from "@/DataContext";
import GrantButtonView from "@/components/GrantButtonView";
import NewGrantCarouselView from "@/components/NewGrantCarouselView";
import createApiClient from "@/clients/apiClient";
import { ActivityIndicator, Button, MD3DarkTheme, PaperProvider, Text, useTheme } from "react-native-paper";
import versionInfo from "@/data/version.json";

export default function Index() {
  const { signOut } = useAuthenticator();
  const navigation = useNavigation();
  const { user } = useAuthenticator();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{
          paddingRight: 10,
        }}>
          <Button
            onPress={signOut}
            mode="outlined"
          >
          Sign out
          </Button>
        </View>
      )
    });
  }, []);

  useEffect(() => {
    async function checkForUpdate() {
      try {
        const response = await fetch("/version.json");
        const latestVersion = await response.json();

        if (latestVersion.version !== versionInfo.version) {
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        console.error("Error checking for update: ", error);
      }
    }

    checkForUpdate();

    const intervalId = setInterval(checkForUpdate, 1000 * 60 * 60);

    return () => clearInterval(intervalId);
  }, []);


  // The landing page intentionally and explicitly uses the "dark" theme for contrast with the
  // other pages. This means that it is not dynamically styled based on the users dark / light
  // color preference.
  const darkTheme = MD3DarkTheme
  const styles = getStyles(darkTheme.colors.surface)

  /** 
   * Wraps the given element in its own PaperProvider, which detaches it from the regular user
   * preference for theme color.
   */
  const wrapInDarkThemeOverride = (element: React.JSX.Element): React.JSX.Element => {
    return (
        <PaperProvider theme={darkTheme}>{element}</PaperProvider>
    )
  } 

  const [isNewGrantView, setIsNewGrantView] = useState<boolean>(false);
  const [newNumbers, setNewNumbers] = useState<{number: number, isNew: boolean}[]>([]);
  const { numberToCountMap,  isLoading, refreshData } = useData();

  if (isLoading) {
      return wrapInDarkThemeOverride(
          <View style={styles.container}>
              <ActivityIndicator size="large" />
          </View>
      );
  }

  if (isNewGrantView) {
    if (newNumbers.length === 0) {
      return wrapInDarkThemeOverride(
        <View style={styles.container}>
          <Text style={darkTheme.fonts.headlineSmall}>No new numbers available</Text>
        </View>
      );
    }

    return wrapInDarkThemeOverride(
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

  return wrapInDarkThemeOverride(
    <View style={styles.container}>
      <Text variant="headlineSmall">Your Number Collection</Text>
      <GridCarouselView numberToCount={numberToCountMap} />
      <GrantButtonView onGetNewNumbersPress={handleGetNewNumbersPress} />
      {isUpdateAvailable && <Text variant="titleMedium">A new version of the app is available. Please refresh to update.</Text>}
    </View>
  );
}

const getStyles = (backgroundColor: string) => {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  }
  });
}