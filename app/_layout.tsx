import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from 'expo-router/drawer';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import { DataProvider } from "@/DataContext";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

Amplify.configure({
  Auth: {
    Cognito: {
      //region: "us-east-1",
      userPoolClientId: "1plkm206kt5gqsbrfmc2bpi6ne",
      userPoolId: "us-east-1_9x8Ke7jsx",
      loginWith: {
        username: true,
        email: true,
      }
    }
  },
});

export default function RootLayout() {
  const paperTheme = MD3LightTheme;
  
  return (
    <Authenticator.Provider>
      <Authenticator>
        <PaperProvider theme={paperTheme}>
          <DataProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Drawer>
                <Drawer.Screen
                  name="index"
                  options={{
                    drawerLabel: "Home",
                    title: "Home",
                  }}
                />
                <Drawer.Screen
                  name="counts"
                  options={{
                    drawerLabel: "Counts",
                    title: "Counts",
                  }}
                />
                <Drawer.Screen
                  name="grants"
                  options={{
                    drawerLabel: "Packs",
                    title: "Packs",
                  }}
                />
              </Drawer>
            </GestureHandlerRootView>
          </DataProvider>
        </PaperProvider>
      </Authenticator>
    </Authenticator.Provider>
  );
}
