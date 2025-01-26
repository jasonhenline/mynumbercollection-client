import { TextStyle, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { getCardColor } from "@/styles/getCardColor";
import { StyleProp } from "@/node_modules/react-native/Libraries/StyleSheet/StyleSheet";
import { ViewStyle } from "@/node_modules/react-native/Libraries/StyleSheet/StyleSheetTypes";
import { convertToWords } from "react-number-to-words";
import { isPrime, isSquare } from "@/utils/math";

type CardViewProps = {
    number: number;
    isNew: boolean;
};

const numberToFlavorText = new Map<number, string>([
    [
        0,
        "The great void. Zero: the number that started it all… or did it? Neither positive nor negative, it’s just chillin’ in the middle.",
    ],
    [
        1,
        "The lone wolf of numbers. A true individualist—always standing alone yet multiplying anything into itself!",
    ],
    [
        2,
        "The dynamic duo. The smallest prime number and the very essence of balance. It’s odd to be this even.",
    ],
    [
        3,
        "Triumphant trio! The first odd prime number. A favorite for triangles, tridents, and troublemakers.",
    ],
    [
        4,
        "Square deal! The result of 2×2. Strong, reliable, and a little bit square. Literally.",
    ],
    [
        5,
        "High five! The number of fingers on a hand and the friendliest digit around. Also, primes love this one.",
    ],
    [
        6,
        "The perfect number… mathematically speaking. Divisible by 1, 2, and 3, it’s just that cool.",
    ],
    [
        7,
        "Lucky number seven! Prime and mysterious, it’s been winning lotteries and hearts since forever.",
    ],
    [
        8,
        "Eight is great! Two cubed and the basis of octopus admiration worldwide. Seriously, who doesn’t love an octopus?",
    ],
    [
        9,
        "Squared away. Three times three equals nine! Watch out, it’s starting to feel exponential in here.",
    ],
    [
        10,
        "The Big Ten. A decimal darling and the cornerstone of human counting systems. Can’t stop this power of ten!",
    ],
    [
        11,
        "The palindrome prime! Reads the same forward and backward, just like it’s showing off in the mirror.",
    ],
    [
        12,
        "A dozen delights! Perfect for eggs, donuts, and dividing into thirds.",
    ],
    [13, "Unlucky for some, but a prime number powerhouse!"],
    [
        14,
        "Double seven, but only half the luck? A composite number with a heart of gold.",
    ],
    [
        15,
        "The quarter-hour king. A multiple of 3 and 5, and every clock’s best friend. Tick-tock!",
    ],
    [
        16,
        "Sweet sixteen! A perfect square (4×4) and the foundation of hexadecimal adventures.",
    ],
    [
        17,
        "Prime and sublime. 17 is mysterious, slightly aloof, and definitely cooler than the other teens.",
    ],
    [
        18,
        "A multiple of everything! Okay, not really, but divisible by 1, 2, 3, 6, and 9. A true team player.",
    ],
    [
        19,
        "Prime and on the brink of twenty. It’s like 19 is teetering between youth and adulthood in number years.",
    ],
    [
        20,
        "Score! Two tens rolled into one. Whether you’re counting fingers, toes, or years, 20 is a milestone.",
    ],
    [69, "Nice."],
]);

function getFlavorText(number: number): string {
    const creativeFlavorText = numberToFlavorText.get(number);
    if (creativeFlavorText) {
        return creativeFlavorText;
    }
    return (
        (number < 0 ? "Negative " : "") + convertToWords(Math.abs(number), "")
    );
}

export default function CardView(props: CardViewProps) {
    const theme = useTheme();

    // Map number to card color
    // white/grey = common, green = uncommon, blue = rare, purple = very rare/mythical, orange = legendary
    const { background, foreground } = getCardColor(props.number);
    // Gradient from rarity color to white?

    // The built in react-native-paper fonts do not have a font large enough for this element, so we've gone a bit custom here.
    const extraLargeFontStyles: StyleProp<TextStyle> = {
        ...theme.fonts.displayLarge,
        fontSize: 80,
        // lineHeight: 120,
        color: foreground,
        fontWeight: "900",
    };

    const boxStyle: StyleProp<ViewStyle> = {
        borderColor: "#00000066",
        backgroundColor: "#ffffff66",
        borderTopColor: "#00000033",
        borderTopWidth: 2,
        borderLeftColor: "#00000033",
        borderLeftWidth: 2,
        borderBottomColor: "#ffffff33",
        borderBottomWidth: 5,
        borderRightColor: "#ffffff33",
        borderRightWidth: 5,
        width: "100%",
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    };

    const negativeStyleOverrides: StyleProp<ViewStyle> = {
        backgroundColor: "transparent",
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: "transparent",
    };

    const iconStyle: StyleProp<ViewStyle> = {
        borderRadius: "100%",
        borderColor: "#00000099",
        borderWidth: 1,
        marginLeft: 8,
        width: 16,
        height: 16,
    };

    const iconTextStyle: StyleProp<TextStyle> = {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 14,
    };

    const prime = isPrime(props.number);
    const square = isSquare(props.number);

    return (
        <View
            style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 240,
                height: 340,
                borderWidth: 10,
                borderColor: props.number < 0 ? "#00000066" : "#ffffff66",
                borderRadius: 20,
                backgroundColor: background,
            }}
        >
            <View
                style={{
                    width: "100%",
                    padding: 8,
                    flexDirection: "row",
                }}
            >
                <Text
                    style={{
                        flex: 1,
                        ...theme.fonts.displaySmall,
                        fontSize: 12,
                        lineHeight: 16,
                        color: props.number >= 0 ? "#000000" : "#ffffff",
                        fontWeight: "bold",
                    }}
                >
                    {props.number}
                </Text>
                {prime && (
                    <View
                        style={{
                            ...iconStyle,
                            backgroundColor: "#006600",
                        }}
                    >
                        <Text
                            style={iconTextStyle}
                            accessibilityLabel="Prime Number"
                        >
                            ◊
                        </Text>
                    </View>
                )}
                {square && (
                    <View
                        style={{
                            ...iconStyle,
                            backgroundColor: "#660000",
                        }}
                    >
                        <Text
                            style={iconTextStyle}
                            accessibilityLabel="Square Number"
                        >
                            ▢
                        </Text>
                    </View>
                )}
            </View>
            <View
                style={{
                    ...boxStyle,
                    ...(props.number < 0 ? negativeStyleOverrides : {}),
                }}
            >
                <Text style={extraLargeFontStyles}>{props.number}</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    padding: 8,
                }}
            >
                <Text
                    style={{
                        ...theme.fonts.displayMedium,
                        fontSize: 12,
                        lineHeight: 14,
                        fontStyle: "italic",
                        color: props.number >= 0 ? "#000000" : "#ffffff",
                    }}
                >
                    {getFlavorText(props.number)}
                </Text>
            </View>
            {props.isNew && (
                <Text
                    variant="headlineSmall"
                    style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: props.number >= 0 ? "#000000" : "#ffffff",
                    }}
                >
                    *NEW*
                </Text>
            )}
        </View>
    );
}
