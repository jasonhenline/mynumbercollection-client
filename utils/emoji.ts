import { CardEntry } from "@/app";
import { getCardRarity, Rarity } from "./rarity";
import { getCardColor } from "@/styles/getCardColor";

export function entryToEmoji(entry: CardEntry) {
    const rarity = getCardRarity(entry.number);

    const rarityToColor: Record<Rarity, string> = {
        [Rarity.Trash]: "⚪️",
        [Rarity.Common]: "🟢",
        [Rarity.Uncommon]: "🔵",
        [Rarity.Rare]: "🟣",
        [Rarity.Mythical]: "🟡",
        [Rarity.Legendary]: "🔴",
        [Rarity.Unique]: "‼️",
    };

    const numberInEmojis = entry.number
        .toString()
        .replaceAll("0", "0️⃣")
        .replaceAll("1", "1️⃣")
        .replaceAll("2", "2️⃣")
        .replaceAll("3", "3️⃣")
        .replaceAll("4", "4️⃣")
        .replaceAll("5", "5️⃣")
        .replaceAll("6", "6️⃣")
        .replaceAll("7", "7️⃣")
        .replaceAll("8", "8️⃣")
        .replaceAll("9", "9️⃣")
        .replaceAll("-", ""); // remove the minus symbol - we re-add it later

    // [rarity color][spacer or "ng"][number to emoji]["new" indicator]: 🟢▫️1️⃣4️⃣ ✨
    const emojiEntry = `${entry.number < 0 ? "⚫️" : rarityToColor[rarity]}${
        entry.number < 0 ? "🆖" : "▫️"
    }${numberInEmojis} ${entry.isNew ? "✨" : ""}`;

    return emojiEntry;
}

export function entriesToEmojis(entries: CardEntry[]) {
    return (
        entries.reduce((acc, curr, ind, arr) => {
            return (
                acc + entryToEmoji(curr) + (ind !== arr.length - 1 ? "\n" : "")
            );
        }, "") + "\n\nmynumbercollection.com"
    );
}
