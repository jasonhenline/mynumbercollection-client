import { useState } from "react";
import { TouchableHighlight, View } from "react-native";
import GridView from "./GridView";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type GridCarouselViewProps = {
    numberToCount: Map<number, number>;
}

export default function GridCarouselView(props: GridCarouselViewProps) {
    const [pageNumber, setPageNumber] = useState(0);

    const numberSet = new Set<number>(props.numberToCount.keys());
    const maxNumber = Math.max(...numberSet);
    const maxPageNumber = Math.floor(maxNumber / 100);

    const leftColor = pageNumber === 0 ? "gray" : "white";
    const rightColor = pageNumber === maxPageNumber ? "gray" : "white";
    const arrowSize = 36;

    return (
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableHighlight onPress={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 0}>
                <AntDesign name="left" color={leftColor} size={arrowSize}></AntDesign>
            </TouchableHighlight>
            <GridView numberToCount={props.numberToCount} startNumber={100 * pageNumber} />
            <TouchableHighlight onPress={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === maxPageNumber}>
                <AntDesign name="right" color={rightColor} size={arrowSize}></AntDesign>
            </TouchableHighlight>
        </View>
    )
}