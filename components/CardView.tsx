import { TextStyle, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { getCardColor } from "@/styles/getCardColor";
import { StyleProp } from "@/node_modules/react-native/Libraries/StyleSheet/StyleSheet";
import { ViewStyle } from "@/node_modules/react-native/Libraries/StyleSheet/StyleSheetTypes";
import { isPrime, isSquare } from "@/utils/math";
import { getFlavorText } from "@/utils/flavortext";

type CardViewProps = {
    number: number;
    isNew: boolean;
};

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
