import { useState } from "react";
import { TouchableHighlight, View } from "react-native";
import GridView from "./GridView";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

type GridCarouselViewProps = {
    numberToCount: Map<number, number>;
    startingPageNumber?: number;
    pressedCardInGrid: (card: number) => void;
    navigatedToPage?: (page: number) => void;
    hideNumbers?: boolean;
    disableNav?: boolean;
};

export default function GridCarouselView(props: GridCarouselViewProps) {
    const [pageNumber, setPageNumber] = useState(props.startingPageNumber ?? 0);

    const numberSet = new Set<number>(props.numberToCount.keys());
    const maxNumber = Math.max(0, ...numberSet);
    const maxPageNumber = Math.floor(maxNumber / 100);

    const minNumber = Math.min(0, ...numberSet);
    const minPageNumber = Math.floor(minNumber / 100);

    const theme = useTheme();

    function rightDisabled() {
        return !!props.disableNav || pageNumber === maxPageNumber;
    }

    function leftDisabled() {
        return !!props.disableNav || pageNumber === minPageNumber;
    }

    const leftColor = leftDisabled()
        ? theme.colors.onSurfaceDisabled
        : theme.colors.onSurface;
    const rightColor = rightDisabled()
        ? theme.colors.onSurfaceDisabled
        : theme.colors.onSurface;
    const arrowSize = 36;

    function updatePageNumber(page: number) {
        setPageNumber(page);
        props.navigatedToPage?.(page);
    }

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableHighlight
                onPress={() => updatePageNumber(pageNumber - 1)}
                disabled={leftDisabled()}
            >
                <AntDesign
                    name="left"
                    color={leftColor}
                    size={arrowSize}
                ></AntDesign>
            </TouchableHighlight>
            <GridView
                numberToCount={props.numberToCount}
                startNumber={100 * pageNumber}
                pressedCardInGrid={props.pressedCardInGrid}
                hideNumbers={props.hideNumbers}
            />
            <TouchableHighlight
                onPress={() => updatePageNumber(pageNumber + 1)}
                disabled={rightDisabled()}
            >
                <AntDesign
                    name="right"
                    color={rightColor}
                    size={arrowSize}
                ></AntDesign>
            </TouchableHighlight>
        </View>
    );
}
