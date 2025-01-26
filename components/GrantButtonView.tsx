import { View, StyleSheet } from "react-native";
import { useData } from "@/DataContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text } from "react-native-paper";

type GrantButtonViewProps = {
    onGetNewNumbersPress: () => void;
};

export default function GrantButtonView(props: GrantButtonViewProps) {
    const [showGrantButton, setShowGrantButton] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<string | null>(null);
    const [localIsLoading, setLocalIsLoading] = useState<boolean>(true);

    const { isLoading, nextGrantTimestamp } = useData();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        const run = () => {
            const now = new Date();
            const timeDifference = nextGrantTimestamp.getTime() - now.getTime();
            if (timeDifference <= 0) {
                setCountdown(null);
                setShowGrantButton(true);
                if (interval) {
                    clearInterval(interval);
                }
            } else {
                const hours = Math.floor(timeDifference / 1000 / 60 / 60);
                const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
                const seconds = Math.floor((timeDifference / 1000) % 60);
                setCountdown(`${hours}h ${minutes}m ${seconds}s`);
            }
            setLocalIsLoading(false);
        };

        interval = setInterval(run, 1000);
        run();
    }, [nextGrantTimestamp]);

    if (isLoading || localIsLoading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (showGrantButton) {
        return (
            <Button mode="contained" onPress={props.onGetNewNumbersPress}>
                Get New Numbers
            </Button>
        );
    }

    return (
        <Text variant="titleMedium">New numbers available in: {countdown}</Text>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
