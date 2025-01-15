import { useState } from "react";
import { Button, Text, TouchableHighlight, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type NewGrantCarouselViewProps = {
    numberToNewMap: Map<number, boolean>;
    onBackToGrid: () => void;
}

export default function NewGrantCarouselView(props: NewGrantCarouselViewProps) {
    const [cardIndex, setCardIndex] = useState(0);
    const sortedNumbers = Array.from(props.numberToNewMap.keys()).sort((a, b) => a - b);

    const leftColor = cardIndex === 0 ? "gray" : "white";
    const rightColor = cardIndex === sortedNumbers.length - 1 ? "gray" : "white";
    const arrowSize = 36;

    return (
        <View style={{alignItems: "center", gap: 20}}>
            <Text style={{color: "#fff", fontSize: 32}}>Your New Numbers</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableHighlight onPress={() => setCardIndex(cardIndex - 1)} disabled={cardIndex === 0}>
                    <AntDesign name="left" color={leftColor} size={arrowSize}></AntDesign>
                </TouchableHighlight>
                <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center", width: 200, height: 350, borderWidth: 1, borderColor: "#fff", borderRadius: 20}}>
                    <Text style={{fontSize: 100, color: "#fff"}}>{sortedNumbers[cardIndex]}</Text>
                    {
                        props.numberToNewMap.get(sortedNumbers[cardIndex]) &&
                            <Text style={{fontSize: 24, color: "#fff"}}>NEW</Text>
                    }
                </View>
                <TouchableHighlight onPress={() => setCardIndex(cardIndex + 1)} disabled={cardIndex === sortedNumbers.length - 1}>
                    <AntDesign name="right" color={rightColor} size={arrowSize}></AntDesign>
                </TouchableHighlight>
            </View>
            <Button title="Back to Grid" onPress={props.onBackToGrid} />
        </View>
    )
}