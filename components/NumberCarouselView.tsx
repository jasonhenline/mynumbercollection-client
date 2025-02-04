import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    useAnimatedValue,
    View,
} from "react-native";
import CardView, { CardDimensions } from "./CardView";
import { AntDesign } from "@expo/vector-icons";
import { Button, Text, TouchableRipple, useTheme } from "react-native-paper";
import { CardEntry } from "@/app";

type NumberCarouselViewProps = {
    numbersToDisplay: CardEntry[];
    carouselTitle: string;
    buildSuspense: boolean;
    startingIndex?: number;
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

    // The visuals work out better if the shuffle duration is not a multiple of the cycle duration
    const shuffleDuration = 2000;
    const cycleDuration = 150;
    const numberOfShuffles = Math.ceil(shuffleDuration / cycleDuration);

    function cycleNumberAfterDelay(cycleCount: number, targetNumber: number) {
        const numberToShow = Math.floor(
            (targetNumber / numberOfShuffles) * cycleCount,
        );

        setOverrideNumber({
            number: numberToShow,
            isNew: false,
        });
        nextCycleTimeout.current = setTimeout(() => {
            cycleNumberAfterDelay(cycleCount + 1, targetNumber);
        }, cycleDuration);
    }

    function stopNumberCycling() {
        setOverrideNumber(undefined);
        clearTimeout(nextCycleTimeout.current);
    }

    const initialScale = Animated.timing(scale.current, {
        toValue: 0.9,
        easing: Easing.linear,
        duration: shuffleDuration,
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
        cycleNumberAfterDelay(0, getCurrent().number);
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
            <Button
                mode="outlined"
                onPress={() =>
                    props.onBackToGrid(props.numbersToDisplay[cardIndex].number)
                }
            >
                Back to Grid
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        position: "absolute",
        left: 36,
    },
});
