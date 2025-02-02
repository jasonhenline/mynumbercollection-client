import { CardEntry } from "@/app";
import { entriesToEmojis, entryToEmoji } from "./emoji";

describe("entryToEmoji", () => {
    it("should properly convert a variety of card entries individually", () => {
        const testEntries: CardEntry[] = [
            { number: 1, isNew: false },
            { number: 12, isNew: true },
            { number: -50, isNew: false },
            { number: 300, isNew: true },
        ];

        const expectedStrings: string[] = [
            "🟢▫️1️⃣ ",
            "🟢▫️1️⃣2️⃣ ✨",
            "⚫️🆖5️⃣0️⃣ ",
            "🟡▫️3️⃣0️⃣0️⃣ ✨",
        ];

        expect(testEntries.map(entryToEmoji)).toEqual(expectedStrings);
    });

    it("should properly convert an entire pull", () => {
        const testEntries: CardEntry[] = [
            { number: -12, isNew: false },
            { number: 14, isNew: true },
            { number: -50, isNew: true },
            { number: 51, isNew: false },
            { number: 55, isNew: true },
            { number: 90, isNew: false },
            { number: 114, isNew: true },
            { number: 212, isNew: false },
            { number: 400, isNew: true },
            { number: 801, isNew: true },
        ];

        // Though the format looks weird here, this is the best way to show what this multiline string should
        // look like
        const expectedEmojiString = `\
⚫️🆖1️⃣2️⃣ 
🟢▫️1️⃣4️⃣ ✨
⚫️🆖5️⃣0️⃣ ✨
🟢▫️5️⃣1️⃣ 
🟢▫️5️⃣5️⃣ ✨
🟢▫️9️⃣0️⃣ 
🔵▫️1️⃣1️⃣4️⃣ ✨
🟣▫️2️⃣1️⃣2️⃣ 
🔴▫️4️⃣0️⃣0️⃣ ✨
‼️▫️8️⃣0️⃣1️⃣ ✨

mynumbercollection.com\
`;

        expect(entriesToEmojis(testEntries)).toEqual(expectedEmojiString);
    });
});
