import { CardEntry } from "@/app";
import { copyTextToClipboard } from "@/utils/clipboard";
import { entriesToEmojis } from "@/utils/emoji";
import { useState } from "react";
import { View } from "react-native";
import {
    IconButton,
    Portal,
    Snackbar,
    Text,
    useTheme,
} from "react-native-paper";

type CopyNumbersProps = {
    numbersToCopy: CardEntry[];
};

export default function CopyNumbers(props: CopyNumbersProps) {
    const theme = useTheme();

    const [copyResultText, setCopyResultText] = useState("");
    const [copyResultVisible, setCopyResultVisible] = useState(false);

    async function copyNumbersToClipboardAsEmoji() {
        try {
            await copyTextToClipboard(entriesToEmojis(props.numbersToCopy));
            setCopyResultText("Copied to clipboard!");
        } catch (err) {
            setCopyResultText("Could not copy to clipboard");
            console.error(err);
        } finally {
            setCopyResultVisible(true);
        }
    }

    return (
        <View>
            <IconButton
                icon={"content-copy"}
                onPress={copyNumbersToClipboardAsEmoji}
            ></IconButton>
            <Portal>
                <Snackbar
                    style={{
                        width: 250,
                        backgroundColor: theme.colors.elevation.level2,
                    }}
                    visible={copyResultVisible}
                    duration={3000}
                    onDismiss={() => setCopyResultVisible(false)}
                >
                    <Text>{copyResultText}</Text>
                </Snackbar>
            </Portal>
        </View>
    );
}
