import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import { DataProvider } from "@/DataContext";
import { MD3Theme, PaperProvider } from "react-native-paper";
import {
    Theme as NavigationTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { CustomDarkTheme, CustomLightTheme } from "@/styles/customtheme";
import { useColorScheme } from "react-native";

Amplify.configure({
    Auth: {
        Cognito: {
            //region: "us-east-1",
            userPoolClientId: "1plkm206kt5gqsbrfmc2bpi6ne",
            userPoolId: "us-east-1_9x8Ke7jsx",
            loginWith: {
                username: true,
                email: true,
            },
        },
    },
});

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const paperTheme =
        colorScheme === "dark" ? CustomDarkTheme : CustomLightTheme;

    /** Following the example from `react-native-paper/src/core/theming.tsx`, convert an MD3Theme into a NavigationTheme */
    const getMirroredReactNavigationTheme = (
        baseTheme: MD3Theme,
    ): NavigationTheme => {
        const reactNavigationRegularFontMirror = {
            fontFamily: paperTheme.fonts.bodySmall.fontFamily,
            fontWeight: paperTheme.fonts.bodySmall.fontWeight || "normal",
        };

        const reactNavigationBoldFontMirror = {
            fontFamily: paperTheme.fonts.titleSmall.fontFamily,
            fontWeight: paperTheme.fonts.titleSmall.fontWeight || "normal",
        };

        return {
            dark: baseTheme.dark,
            colors: {
                primary: paperTheme.colors.primary,
                background: paperTheme.colors.surface,
                card: paperTheme.colors.elevation.level2,
                text: paperTheme.colors.onSurface,
                border: paperTheme.colors.outlineVariant,
                notification: paperTheme.colors.error,
            },
            fonts: {
                regular: reactNavigationRegularFontMirror,
                medium: reactNavigationRegularFontMirror,
                bold: reactNavigationBoldFontMirror,
                heavy: reactNavigationBoldFontMirror,
            },
        };
    };

    // This unfortunate double-theming is necessary because expo-router does not directly integrate with react-native-paper.
    // expo-router uses react-navigation under the hood to perform navigation, which provides its own themed styles to the
    // react-navigation sub-components that expo-router wraps and provides. In order to standardize styles across the entire
    // application, we have to convert our core themes (from react-native-paper) to react-navigation style themes. We use an
    // approach very similar to what react-native-paper recommends, but with some slight tweaks.
    const reactNavigationTheme = getMirroredReactNavigationTheme(paperTheme);

    return (
        <Authenticator.Provider>
            <Authenticator>
                <PaperProvider theme={paperTheme}>
                    <ThemeProvider value={reactNavigationTheme}>
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
                    </ThemeProvider>
                </PaperProvider>
            </Authenticator>
        </Authenticator.Provider>
    );
}
