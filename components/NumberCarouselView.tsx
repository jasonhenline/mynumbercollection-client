import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import CardView, { CardDimensions } from "./CardView";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text, TouchableRipple, useTheme } from "react-native-paper";
import { CardEntry } from "@/app";
import CopyNumbers from "./CopyNumbers";

type NumberCarouselViewProps = {
    numbersToDisplay: CardEntry[];
    carouselTitle: string;
    buildSuspense: boolean;
    startingIndex?: number;
    showCopyIcon?: boolean;
    onBackToGrid: (currentNumber: number) => void;
};

export default function NumberCarouselView(props: NumberCarouselViewProps) {
    const [cardIndex, setCardIndex] = useState(
        Math.min(
            Math.max(props.startingIndex ?? 0, 0),
            props.numbersToDisplay.length - 1,
        ),
    );
    const [overrideNumber, setOverrideNumber] = useState<CardEntry | undefined>(
        undefined,
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

    const arrowSize = styles.card.left;

    function getCurrent() {
        return overrideNumber ?? props.numbersToDisplay[cardIndex];
    }

    /**
     * For the transforms and layering animations to work, the cards themselves are
     * positioned absolutely. This spacer reserves an equivalent amount of space in
     * the flex layout
     */
    function cardFlexSpacer() {
        return <View style={CardDimensions}></View>;
    }

    const nextCycleTimeout = useRef<NodeJS.Timeout | number | undefined>(
        undefined,
    );

    const scale = useRef(new Animated.Value(1));

    // Manually trigger cycling again when moving to the next card by invalidating this
    // sentinel dependency
    const [cyclingTrigger, setCyclingTrigger] = useState({});

    function cycleNumberAfterDelay() {
        setOverrideNumber({
            number: Math.floor(Math.random() * 1000),
            isNew: false,
        });
        nextCycleTimeout.current = setTimeout(() => {
            cycleNumberAfterDelay();
        }, 100);
    }

    function stopNumberCycling() {
        setOverrideNumber(undefined);
        clearTimeout(nextCycleTimeout.current);
    }

    const initialScale = Animated.timing(scale.current, {
        toValue: 0.9,
        easing: Easing.linear,
        duration: 1750,
        delay: 150,
        useNativeDriver: true,
    });

    const finalScale = Animated.timing(scale.current, {
        toValue: 1,
        duration: 400,
        delay: 0,
        useNativeDriver: true,
    });

    /** Entirely abort any running animations and stop cycling numbers */
    function abortAnimation() {
        initialScale.reset();
        finalScale.reset();
        stopNumberCycling();
    }

    useEffect(() => {
        if (!props.buildSuspense) {
            return;
        }
        scale.current.setValue(0.75);
        cycleNumberAfterDelay();
        initialScale.start((result) => {
            if (!result.finished) {
                return;
            }
            stopNumberCycling();
            finalScale.start();
        });
    }, [cyclingTrigger]);

    function setIndexAndMaybeStartCycling(index: number) {
        setCardIndex(index);
        abortAnimation();
        if (props.buildSuspense) {
            setCyclingTrigger({});
        }
    }

    return (
        <View style={{ alignItems: "center", gap: 20 }}>
            <Text variant="headlineLarge">{props.carouselTitle}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {props.numbersToDisplay.length > 1 && (
                    <TouchableRipple
                        onPress={() =>
                            setIndexAndMaybeStartCycling(cardIndex - 1)
                        }
                        disabled={cardIndex === 0}
                    >
                        <AntDesign
                            name="left"
                            color={leftColor}
                            size={arrowSize}
                        ></AntDesign>
                    </TouchableRipple>
                )}
                {cardFlexSpacer()}
                <Animated.View
                    style={{
                        ...styles.card,
                        transform: [
                            {
                                scale: props.buildSuspense ? scale.current : 1,
                            },
                        ],
                    }}
                >
                    <TouchableRipple
                        onPress={abortAnimation}
                        rippleColor={"rgba(0,0,0,0)"}
                    >
                        <CardView
                            number={getCurrent().number}
                            isNew={!!numberToNewMap.get(getCurrent().number)}
                        ></CardView>
                    </TouchableRipple>
                </Animated.View>
                {props.numbersToDisplay.length > 1 && (
                    <TouchableRipple
                        onPress={() =>
                            setIndexAndMaybeStartCycling(cardIndex + 1)
                        }
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
            <View style={styles.buttonFooter}>
                <Button
                    mode="outlined"
                    onPress={() =>
                        props.onBackToGrid(
                            props.numbersToDisplay[cardIndex].number,
                        )
                    }
                >
                    Back to Grid
                </Button>
                {props.showCopyIcon ? (
                    <CopyNumbers
                        numbersToCopy={props.numbersToDisplay}
                    ></CopyNumbers>
                ) : undefined}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        position: "absolute",
        left: 36,
    },
    buttonFooter: {
        flexDirection: "row",
        alignItems: "center",
    },
});
