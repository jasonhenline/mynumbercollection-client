import { useState } from "react";
import { TouchableHighlight, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text, TouchableRipple, useTheme } from "react-native-paper";

type NewGrantCarouselViewProps = {
    newNumbers: {number: number, isNew: boolean}[];
    onBackToGrid: () => void;
}

export default function NewGrantCarouselView(props: NewGrantCarouselViewProps) {
    const [cardIndex, setCardIndex] = useState(0);
    const numberToNewMap = new Map<number, boolean>();
    for (const {number, isNew} of props.newNumbers) {
        numberToNewMap.set(number, isNew);
    }

    const sortedNumbers = props.newNumbers.map((n) => n.number).sort((a, b) => a - b);

    const theme = useTheme()

    const leftColor = cardIndex === 0 ? theme.colors.onSurfaceDisabled : theme.colors.onSurface;
    const rightColor = cardIndex === sortedNumbers.length - 1 ? theme.colors.onSurfaceDisabled : theme.colors.onSurface;
    const arrowSize = 36;

    // The built in react-native-paper fonts do not have a font large enough for this element, so we've gone a bit custom here.
    const extraLargeFontStyles = {
        ...theme.fonts.displayLarge,
        fontSize: 100,
        lineHeight: 120,
    }

    return (
        <View style={{alignItems: "center", gap: 20}}>
            <Text variant="headlineLarge">Your New Numbers</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableRipple onPress={() => setCardIndex(cardIndex - 1)} disabled={cardIndex === 0}>
                    <AntDesign name="left" color={leftColor} size={arrowSize}></AntDesign>
                </TouchableRipple>
                <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center", width: 180, height: 290, borderWidth: 1, borderColor: theme.colors.onSurface, borderRadius: 20}}>
                    <Text style={extraLargeFontStyles}>{sortedNumbers[cardIndex]}</Text>
                    {
                        numberToNewMap.get(sortedNumbers[cardIndex]) &&
                            <Text variant="headlineSmall">NEW</Text>
                    }
                </View>
                <TouchableRipple onPress={() => setCardIndex(cardIndex + 1)} disabled={cardIndex === sortedNumbers.length - 1}>
                    <AntDesign name="right" color={rightColor} size={arrowSize}></AntDesign>
                </TouchableRipple>
            </View>
            <Text variant="headlineMedium">{cardIndex + 1}/{sortedNumbers.length}</Text>
            <Button mode="contained" onPress={props.onBackToGrid}>Back to Grid</Button>
        </View>
    )
}