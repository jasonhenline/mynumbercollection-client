import { ActivityIndicator, Button, Text, View, StyleSheet } from "react-native";
import { useData } from "@/DataContext";
import { useEffect, useState } from "react";

type GrantButtonViewProps = {
    onGetNewNumbersPress: () => void;
}

export default function GrantButtonView(props: GrantButtonViewProps) {
    const [showGrantButton, setShowGrantButton] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<string|null>(null);
    const [localIsLoading, setLocalIsLoading] = useState<boolean>(true);

    const { isLoading, nextGrantTimestamp } = useData();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>|null = null;
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
        }

        interval = setInterval(run, 1000);
        run();
    }, [nextGrantTimestamp])

    if (isLoading || localIsLoading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (showGrantButton) {
        return <Button title="Get New Numbers" onPress={props.onGetNewNumbersPress}></Button>
    }

    console.log(`XXXXXXXXXXX returning countdown view`);
    return (
        <Text style={styles.countdown}>New numbers available in: {countdown}</Text>
    )
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    countdown: { fontSize: 18, textAlign: "center", color: "#fff" },
});