import GridCarouselView from "@/components/GridCarouselView";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { Linking, StyleSheet, View } from "react-native";
import { useData } from "@/DataContext";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";

export default function Conway() {
    const { numberToCountMap, isLoading } = useData();

    const currentGridState = useRef<Map<number, number>>(numberToCountMap);
    const [renderedGridState, setRenderedGridState] =
        useState<Map<number, number>>(numberToCountMap);
    const [currentPage, setCurrentPage] = useState(0);
    const [running, setRunning] = useState(false);
    const timeout = useRef<number | NodeJS.Timeout | undefined>(undefined);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    function navigatedToPage(page: number) {
        reset();
        setCurrentPage(page);
    }

    /**
     * Whenever the grid is updated, we update both the ref and the state to ensure that
     * both additional iterations have the right data, and the right content is being rendered.
     */
    function updateGrid(map: Map<number, number>) {
        currentGridState.current = map;
        setRenderedGridState(map);
    }

    function start(flipped: boolean = false) {
        const startingGrid = new Map(numberToCountMap);

        if (flipped) {
            // Make sure we are including the necessary "flips" up to the end of the page
            const min = Math.min(...startingGrid.keys()) - 100;
            const max = Math.max(...startingGrid.keys()) + 100;
            for (let i = min; i <= max; i++) {
                if (startingGrid.has(i)) {
                    startingGrid.delete(i);
                } else {
                    startingGrid.set(i, 1);
                }
            }
        }
        updateGrid(startingGrid);
        setRunning(true);
        timeout.current = setInterval(updateBoardState, 750);
    }

    function updateBoardState() {
        const startingGrid: boolean[][] = makeBoolGridFromNumberRange();

        const newGrid = applyConwayGameRules(startingGrid);

        const numberMap = makeNumberMapFromBoolGrid(newGrid);
        updateGrid(numberMap);
    }

    function applyConwayGameRules(startingGrid: boolean[][]): boolean[][] {
        const newGrid: boolean[][] = new Array(10)
            .fill(false)
            .map(() => new Array(10).fill(false));

        for (const [rowIdx, row] of startingGrid.entries()) {
            for (const [colIdx, col] of row.entries()) {
                const neighbors = countOfLiveNeighbors(
                    rowIdx,
                    colIdx,
                    startingGrid,
                );
                if (col) {
                    if (neighbors < 2 || neighbors > 3) {
                        // Live cell dies with <2 neighbors or >3 neighbors
                        newGrid[rowIdx][colIdx] = false;
                    } else {
                        // Live cell survives with two or 3 neighbors
                        newGrid[rowIdx][colIdx] = true;
                    }
                } else {
                    if (neighbors == 3) {
                        // Dead cell revives with exactly three neighbors
                        newGrid[rowIdx][colIdx] = true;
                    }
                }
            }
        }

        return newGrid;
    }

    /** @returns the number of neighbors who are `true` in `grid` */
    function countOfLiveNeighbors(
        row: number,
        col: number,
        grid: boolean[][],
    ): number {
        const offsets: [number, number][] = [
            [0, -1],
            [0, 1],
            [1, 0],
            [-1, 0],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
        ];

        let neighborCount = 0;

        for (const offset of offsets) {
            const checkRow = row + offset[0];
            const checkCol = col + offset[1];

            if (
                checkRow >= grid.length ||
                checkRow < 0 ||
                checkCol >= grid[checkRow].length ||
                checkCol < 0
            ) {
                continue;
            }
            if (grid[checkRow][checkCol]) {
                neighborCount += 1;
            }
        }
        return neighborCount;
    }

    /**
     * Returns an effectively zero-indexed version of the current page, as a 2D bool array
     */
    function makeBoolGridFromNumberRange() {
        const simStart = currentPage * 100;
        const simEnd = simStart + 99;

        const activeTiles = [...currentGridState.current.keys()].filter(
            (key) => key <= simEnd && key >= simStart,
        );

        // Convert to a 2D grid of true / false
        const grid: boolean[][] = new Array(10)
            .fill(false)
            .map(() => new Array(10).fill(false));

        for (const tile of activeTiles) {
            // Account for the offset
            const gridValue = tile - simStart;
            const row = Math.floor(gridValue / 10);
            const col = gridValue % 10;
            grid[row][col] = true;
        }
        return grid;
    }

    /**
     * This is a lossy conversion - we only return a map that has the currently visible
     * numbers, and we assume all of them have a count of 1. Since this is basically just
     * a proxy for rendering the current grid during the game simulation, that's fine.
     */
    function makeNumberMapFromBoolGrid(grid: boolean[][]): Map<number, number> {
        const simStart = currentPage * 100;
        const numberMap = new Map<number, number>();
        for (const [rowIdx, row] of grid.entries()) {
            for (const [colIdx, col] of row.entries()) {
                if (col) {
                    numberMap.set(simStart + (rowIdx * 10 + colIdx), 1);
                }
            }
        }
        return numberMap;
    }

    function reset() {
        clearInterval(timeout.current);
        timeout.current = undefined;
        setRunning(false);
        updateGrid(numberToCountMap);
    }

    function openConwaysWiki() {
        Linking.openURL(
            "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
        );
    }

    return (
        <View style={styles.container}>
            <Text variant="headlineSmall">Conway's Game of Life</Text>
            <Text
                style={styles.linkLike}
                variant="bodySmall"
                onPress={openConwaysWiki}
            >
                Wikipedia
            </Text>
            <GridCarouselView
                numberToCount={running ? renderedGridState : numberToCountMap}
                startingPageNumber={currentPage}
                pressedCardInGrid={() => {}}
                navigatedToPage={navigatedToPage}
                hideNumbers={running}
                disableNav={running}
            />
            {running ? (
                <Button mode="contained-tonal" onPress={reset}>
                    Stop
                </Button>
            ) : (
                <View style={styles.buttonCluster}>
                    <Button mode="contained" onPress={() => start()}>
                        Start
                    </Button>
                    <Button mode="outlined" onPress={() => start(true)}>
                        Start (flipped)
                    </Button>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    buttonCluster: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    linkLike: {
        textDecorationLine: "underline",
    },
});
