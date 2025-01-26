import { StyleSheet, TextStyle, View } from "react-native";
import { Text, Tooltip, useTheme } from "react-native-paper";
import { getCardColor } from "@/styles/getCardColor";
import { StyleProp } from "@/node_modules/react-native/Libraries/StyleSheet/StyleSheet";
import { ViewStyle } from "@/node_modules/react-native/Libraries/StyleSheet/StyleSheetTypes";
import { isPrime, isSquare } from "@/utils/math";
import { getFlavorText } from "@/utils/flavortext";

type CardViewProps = {
    number: number;
    isNew: boolean;
};

export const CardDimensions = {
    height: 340,
    width: 240,
};

export default function CardView(props: CardViewProps) {
    const theme = useTheme();

    // Map number to card color
    // white/grey = common, green = uncommon, blue = rare, purple = very rare/mythical, orange = legendary
    const { background, foreground } = getCardColor(props.number);
    // Gradient from rarity color to white?

    // The built in react-native-paper fonts do not have a font large enough for this element, so we've gone a bit custom here.
    const extraLargeFontOverride: StyleProp<TextStyle> = {
        ...theme.fonts.displayLarge,
        color: foreground,
    };

    const prime = isPrime(props.number);
    const square = isSquare(props.number);

    return (
        <View
            style={{
                ...styles.cardContainer,
                width: CardDimensions.width,
                height: CardDimensions.height,
                borderColor: props.number < 0 ? "#00000066" : "#ffffff66",
                backgroundColor: background,
            }}
        >
            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                }}
            >
                <Text
                    style={{
                        ...theme.fonts.displaySmall,
                        ...styles.topLeftNumber,
                        color: props.number >= 0 ? "#000000" : "#ffffff",
                    }}
                >
                    {props.number}
                </Text>
                {prime && (
                    <Tooltip title="Prime">
                        <View
                            style={{
                                ...styles.iconStyle,
                                backgroundColor: "#006600",
                            }}
                        >
                            <Text
                                style={styles.iconTextStyle}
                                accessibilityLabel="Prime Number"
                            >
                                P
                            </Text>
                        </View>
                    </Tooltip>
                )}
                {square && (
                    <Tooltip title="Square">
                        <View
                            style={{
                                ...styles.iconStyle,
                                backgroundColor: "#660000",
                            }}
                        >
                            <Text
                                style={styles.iconTextStyle}
                                accessibilityLabel="Square Number"
                            >
                                ▢
                            </Text>
                        </View>
                    </Tooltip>
                )}
            </View>
            <View
                style={{
                    ...styles.boxStyle,
                    ...(props.number < 0 ? styles.negativeStyleOverrides : {}),
                }}
            >
                <Text
                    style={{
                        ...extraLargeFontOverride,
                        ...styles.extraLargeFontStyles,
                        color: foreground,
                    }}
                >
                    {props.number}
                </Text>
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

const styles = StyleSheet.create({
    extraLargeFontStyles: {
        fontSize: 80,
        // lineHeight: 120,
        fontWeight: "900",
    },
    cardContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 10,
        borderRadius: 20,
    },
    boxStyle: {
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
    },
    negativeStyleOverrides: {
        backgroundColor: "transparent",
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: "transparent",
    },
    iconStyle: {
        borderRadius: "100%",
        borderColor: "#00000099",
        borderWidth: 1,
        margin: 8,
        width: 16,
        height: 16,
    },
    iconTextStyle: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 14,
    },
    topLeftNumber: {
        flex: 1,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "bold",
        padding: 8,
    },
});
