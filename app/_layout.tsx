import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from 'expo-router/drawer';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import { DataProvider } from "@/DataContext";

Amplify.configure({
  Auth: {
    Cognito: {
      //region: "us-east-1",
      userPoolClientId: "1plkm206kt5gqsbrfmc2bpi6ne",
      userPoolId: "us-east-1_9x8Ke7jsx",
    }
  },
});

export default function RootLayout() {
  return (
    <Authenticator.Provider>
      <Authenticator>
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
      </Authenticator>
    </Authenticator.Provider>
  );
}
