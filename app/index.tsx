import { View, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import GridCarouselView from "@/components/GridCarouselView";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useEffect, useState } from "react";
import { useData } from "@/DataContext";
import GrantButtonView from "@/components/GrantButtonView";
import NumberCarouselView from "@/components/NumberCarouselView";
import createApiClient from "@/clients/apiClient";
import {
    ActivityIndicator,
    Button,
    Modal,
    ThemeProvider as PaperThemeOnlyProvider,
    Text,
} from "react-native-paper";
import versionInfo from "@/data/version.json";
import { CustomDarkTheme } from "@/styles/customtheme";
import SettingsModal from "@/components/SettingsModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CardEntry {
    number: number;
    isNew: boolean;
}

export default function Index() {
    const { signOut } = useAuthenticator();
    const navigation = useNavigation();
    const { user } = useAuthenticator();
    const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View
                    style={{
                        paddingRight: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <Button
                        onPress={() =>
                            setShowSettings((prevState) => !prevState)
                        }
                        mode="text"
                    >
                        Settings
                    </Button>
                    <Button onPress={signOut} mode="outlined">
                        Sign out
                    </Button>
                </View>
            ),
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
    const darkTheme = CustomDarkTheme;
    const styles = getStyles(darkTheme.colors.surface);

    /**
     * Wraps the given element in its own PaperProvider, which detaches it from the regular user
     * preference for theme color.
     */
    const wrapAsDefaultIndexView = (
        element: React.JSX.Element,
    ): React.JSX.Element => {
        return (
            <PaperThemeOnlyProvider theme={darkTheme}>
                {element}
                <SettingsModal
                    visible={showSettings}
                    onDismiss={() => setShowSettings(!showSettings)}
                ></SettingsModal>
            </PaperThemeOnlyProvider>
        );
    };

    const [isShowNumberView, setShowNumberView] = useState<boolean>(false);
    const [numbersToDisplay, setNewNumbers] = useState<CardEntry[]>([]);
    const [showNumberDisplayTitle, setShowNumberDisplayTitle] =
        useState<string>("Your new numbers");
    const [showNumberStartingIndex, setShowNumberStartingIndex] =
        useState<number>(0);
    const [startingNumberGridPage, setStartingNumberGridPage] = useState(0);
    const [buildSuspenseInNumberCarousel, setBuildSuspenseInNumberCarousel] =
        useState(false);
    const { numberToCountMap, isLoading, refreshData } = useData();

    if (isLoading) {
        return wrapAsDefaultIndexView(
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>,
        );
    }

    if (isShowNumberView) {
        if (numbersToDisplay.length === 0) {
            return wrapAsDefaultIndexView(
                <View style={styles.container}>
                    <Text style={darkTheme.fonts.headlineSmall}>
                        No numbers to show
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => setShowNumberView(false)}
                    >
                        Back to Grid
                    </Button>
                </View>,
            );
        }

        return wrapAsDefaultIndexView(
            <View style={styles.container}>
                <NumberCarouselView
                    numbersToDisplay={numbersToDisplay}
                    carouselTitle={showNumberDisplayTitle}
                    buildSuspense={buildSuspenseInNumberCarousel}
                    startingIndex={showNumberStartingIndex}
                    onBackToGrid={(number) => {
                        setStartingNumberGridPage(Math.floor(number / 100));
                        setShowNumberView(false);
                    }}
                />
            </View>,
        );
    }

    function setupAndShowNumberDisplayState({
        numbersToShow,
        showNumberDisplayTitle,
        showNumberStartingIndex = 0,
        buildSuspense = false,
    }: {
        numbersToShow: CardEntry[];
        showNumberDisplayTitle: string;
        showNumberStartingIndex?: number;
        buildSuspense?: boolean;
    }) {
        setBuildSuspenseInNumberCarousel(buildSuspense);
        setNewNumbers(numbersToShow);
        setShowNumberDisplayTitle(showNumberDisplayTitle);
        setShowNumberStartingIndex(showNumberStartingIndex);
        setShowNumberView(true);
    }

    async function handleGetNewNumbersPress() {
        const oldNumbers = new Set<number>([...numberToCountMap.keys()]);
        const apiClient = await createApiClient();
        const fetchedNumbers = await apiClient.fetchNewNumbers(user.userId);
        const newNumbersValue: CardEntry[] = [];
        for (const [n, c] of fetchedNumbers.entries()) {
            const isNew = !oldNumbers.has(n);
            for (let i = 0; i < c; i++) {
                newNumbersValue.push({ number: n, isNew });
            }
        }
        await refreshData();
        const sortedNumbers = newNumbersValue.sort(
            (a, b) => Math.abs(a.number) - Math.abs(b.number),
        );

        // default to off (this will also be false if the value is null / unset)
        const suspensefulDrops =
            (await AsyncStorage.getItem("suspensefulDrops")) === "true";

        setupAndShowNumberDisplayState({
            numbersToShow: sortedNumbers,
            showNumberDisplayTitle: "Your new numbers",
            buildSuspense: suspensefulDrops,
        });
    }

    const triggerCollectionViewFromStartingCard = (card: number) => {
        const allCards = [...numberToCountMap.keys()].map((key) => {
            return { number: key, isNew: false };
        });

        const startingIndex = allCards.findIndex(({ number }: CardEntry) => {
            return number === card;
        });
        setupAndShowNumberDisplayState({
            numbersToShow: allCards,
            showNumberDisplayTitle: "",
            showNumberStartingIndex: startingIndex,
            buildSuspense: false,
        });
    };

    return wrapAsDefaultIndexView(
        <View style={styles.container}>
            <Text variant="headlineSmall">Your Number Collection</Text>
            <GridCarouselView
                numberToCount={numberToCountMap}
                startingPageNumber={startingNumberGridPage}
                pressedCardInGrid={triggerCollectionViewFromStartingCard}
            />
            <GrantButtonView onGetNewNumbersPress={handleGetNewNumbersPress} />
            {isUpdateAvailable && (
                <Text variant="titleMedium">
                    A new version of the app is available. Please refresh to
                    update.
                </Text>
            )}
        </View>,
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
        },
    });
};
