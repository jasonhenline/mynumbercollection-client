import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from 'expo-router/drawer';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";

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
              name="about"
              options={{
                drawerLabel: "About",
                title: "About",
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </Authenticator>
    </Authenticator.Provider>
  );
}
