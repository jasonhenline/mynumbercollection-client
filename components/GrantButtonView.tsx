import { ActivityIndicator, Button, Text, View, StyleSheet } from "react-native";
import { useData } from "@/DataContext";
import { useEffect, useState } from "react";

export default function GrantButtonView() {
    const [showGrantButton, setShowGrantButton] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<string|null>(null);

    const { isLoading, nextGrantTimestamp } = useData();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeDifference = nextGrantTimestamp.getTime() - now.getTime();
            if (timeDifference <= 0) {
                setCountdown(null);
                setShowGrantButton(true);
                clearInterval(interval);
            } else {
                const hours = Math.floor(timeDifference / 1000 / 60 / 60);
                const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
                const seconds = Math.floor((timeDifference / 1000) % 60);
                setCountdown(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);
    }, [nextGrantTimestamp])

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#fff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (showGrantButton) {
        return <Button title="Get New Numbers" onPress={() => {}}></Button>
    }

    return (
        <Text style={styles.countdown}>New numbers available in: {countdown}</Text>
    )
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    countdown: { fontSize: 18, textAlign: "center", color: "#fff" },
});