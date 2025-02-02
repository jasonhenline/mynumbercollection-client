import { View, StyleSheet } from "react-native";
import { Modal, Switch, useTheme } from "react-native-paper";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

type SettingsModalProps = {
    visible: boolean;
    onDismiss: () => void;
};
export default function SettingsModal(props: SettingsModalProps) {
    const theme = useTheme();

    const [suspensefulDrops, setSuspensefulDrops] = useState(false);

    const { getItem, setItem } = useAsyncStorage("suspensefulDrops");
    const readSuspensefulDropsFromStorage = async () => {
        const item = await getItem();
        // Default to on
        setSuspensefulDrops(item === "true" || item === null);
    };

    const writeSuspensefulDropsToStorage = async (newValue: boolean) => {
        await setItem(`${newValue}`);
        setSuspensefulDrops(newValue);
    };

    useEffect(() => {
        readSuspensefulDropsFromStorage();
    }, []);

    return (
        <Modal
            style={styles.modal}
            visible={props.visible}
            onDismiss={() => props.onDismiss()}
        >
            <View
                style={{
                    ...styles.modalBody,
                    backgroundColor: theme.colors.elevation.level1,
                }}
            >
                <Text variant={"titleMedium"}>Settings</Text>
                <View style={styles.settingContainer}>
                    <Text>Suspenseful drops</Text>
                    <Switch
                        value={suspensefulDrops}
                        onValueChange={writeSuspensefulDropsToStorage}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        alignItems: "center",
    },
    modalBody: {
        padding: 16,
        borderRadius: 8,
        alignItems: "baseline",
    },
    settingContainer: {
        flexDirection: "row",
        gap: 16,
        margin: 16,
    },
});
