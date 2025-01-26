import { useState } from "react";
import { View } from "react-native";
import CardView from "./CardView";
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

    const sortedNumbers = props.newNumbers.map((n) => n.number).sort((a, b) => Math.abs(a) - Math.abs(b));

    const theme = useTheme()

    const leftColor = cardIndex === 0 ? theme.colors.onSurfaceDisabled : theme.colors.onSurface;
    const rightColor = cardIndex === sortedNumbers.length - 1 ? theme.colors.onSurfaceDisabled : theme.colors.onSurface;
    const arrowSize = 36;

    return (
        <View style={{alignItems: "center", gap: 20}}>
            <Text variant="headlineLarge">Your New Numbers</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableRipple onPress={() => setCardIndex(cardIndex - 1)} disabled={cardIndex === 0}>
                    <AntDesign name="left" color={leftColor} size={arrowSize}></AntDesign>
                </TouchableRipple>
                <CardView number={sortedNumbers[cardIndex]} isNew={!!numberToNewMap.get(sortedNumbers[cardIndex])}></CardView>
                <TouchableRipple onPress={() => setCardIndex(cardIndex + 1)} disabled={cardIndex === sortedNumbers.length - 1}>
                    <AntDesign name="right" color={rightColor} size={arrowSize}></AntDesign>
                </TouchableRipple>
            </View>
            <Text variant="headlineMedium">{cardIndex + 1}/{sortedNumbers.length}</Text>
            <Button mode="contained" onPress={props.onBackToGrid}>Back to Grid</Button>
        </View>
    )
}