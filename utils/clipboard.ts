import * as Clipboard from "expo-clipboard";

export async function copyTextToClipboard(text: string) {
    return Clipboard.setStringAsync(text);
}
