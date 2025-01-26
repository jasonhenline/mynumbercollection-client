import { useState } from "react";
import { View } from "react-native";
import CardView from "./CardView";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text, TouchableRipple, useTheme } from "react-native-paper";
import { CardEntry } from "@/app";

type NumberCarouselViewProps = {
    numbersToDisplay: CardEntry[];
    carouselTitle: string;
    startingIndex?: number;
    onBackToGrid: () => void;
};

export default function NumberCarouselView(props: NumberCarouselViewProps) {
    const [cardIndex, setCardIndex] = useState(
        Math.min(
            Math.max(props.startingIndex ?? 0, 0),
            props.numbersToDisplay.length - 1,
        ),
    );
    const numberToNewMap = new Map<number, boolean>();
    for (const { number, isNew } of props.numbersToDisplay) {
        numberToNewMap.set(number, isNew);
    }

    const theme = useTheme();

    const leftColor =
        cardIndex === 0
            ? theme.colors.onSurfaceDisabled
            : theme.colors.onSurface;
    const rightColor =
        cardIndex === props.numbersToDisplay.length - 1
            ? theme.colors.onSurfaceDisabled
            : theme.colors.onSurface;
    const arrowSize = 36;

    return (
        <View style={{ alignItems: "center", gap: 20 }}>
            <Text variant="headlineLarge">{props.carouselTitle}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {props.numbersToDisplay.length > 1 && (
                    <TouchableRipple
                        onPress={() => setCardIndex(cardIndex - 1)}
                        disabled={cardIndex === 0}
                    >
                        <AntDesign
                            name="left"
                            color={leftColor}
                            size={arrowSize}
                        ></AntDesign>
                    </TouchableRipple>
                )}
                <CardView
                    number={props.numbersToDisplay[cardIndex].number}
                    isNew={
                        !!numberToNewMap.get(
                            props.numbersToDisplay[cardIndex].number,
                        )
                    }
                ></CardView>
                {props.numbersToDisplay.length > 1 && (
                    <TouchableRipple
                        onPress={() => setCardIndex(cardIndex + 1)}
                        disabled={
                            cardIndex === props.numbersToDisplay.length - 1
                        }
                    >
                        <AntDesign
                            name="right"
                            color={rightColor}
                            size={arrowSize}
                        ></AntDesign>
                    </TouchableRipple>
                )}
            </View>
            {props.numbersToDisplay.length > 1 && (
                <Text variant="headlineMedium">
                    {cardIndex + 1}/{props.numbersToDisplay.length}
                </Text>
            )}
            <Button mode="contained" onPress={props.onBackToGrid}>
                Back to Grid
            </Button>
        </View>
    );
}
