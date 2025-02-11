import { ScrollView, View } from "react-native";
import {
    ActivityIndicator,
    Divider,
    SegmentedButtons,
    Text,
} from "react-native-paper";
import { StyleSheet } from "react-native";
import { useData } from "@/DataContext";
import { getGrantString, Grant } from "@/model/Grant";
import { useState } from "react";

interface StatResult {
    output: number[];
    additionalText?: string;
}

interface StatEntry {
    title: string;
    isAbsolute?: boolean;
    requiresNegatives?: boolean;
    calc: () => StatResult;
}

interface StatBlock {
    title: string;
    stats: StatEntry[];
}

export default function Stats() {
    const { grants: nonTimeBoundUnsafeGrants, isLoading } = useData();

    // Must be a string to work with the SegmentedButton. Should be set to a whole number of
    // days to consider on the stats page
    const [daysToConsider, setDaysToConsider] = useState("0");

    /** @returns the grants that we should consider when calculating status, properly filtered for the day range */
    function getTimeBoundGrants() {
        const daysAsNumber = Number(daysToConsider);
        if (daysAsNumber == 0) {
            return nonTimeBoundUnsafeGrants;
        } else {
            return nonTimeBoundUnsafeGrants.filter(
                (grant) =>
                    grant.timestamp.getTime() >
                    Date.now() - 1000 * 60 * 60 * 24 * daysAsNumber,
            );
        }
    }

    /** @returns a number to count map that only includes numbers from the current day range */
    function timeBoundNumberToCountMap() {
        const grants = getTimeBoundGrants();
        const numberToCountMapFromGrants = new Map<number, number>();

        for (const grant of grants) {
            for (const [num, count] of grant.numberToCountMap) {
                const currentCount = numberToCountMapFromGrants.get(num) ?? 0;

                numberToCountMapFromGrants.set(num, currentCount + count);
            }
        }
        return numberToCountMapFromGrants;
    }

    /** A sorted flat-list of every number that has been pulled at least once */
    const sortedFlatPulls = [
        ...new Set(timeBoundNumberToCountMap().keys()),
    ].sort(sortByValueAscending);

    const hasNegatives = sortedFlatPulls[0] < 0;

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator size="large" style={{ paddingTop: 32 }} />
            </View>
        );
    }

    /** @returns a string representation of the given iterable of numbers */
    function numberString(numbers: Iterable<number>) {
        const numberArray = [...numbers];
        return numberArray
            .slice(1)
            .reduce((acc, num) => acc + `, ${num}`, `${numberArray[0]}`);
    }

    /** @returns a single stat-line view for the given statFunc */
    function makeStatLine(
        {
            title,
            calc,
            isAbsolute = false,
            requiresNegatives = false,
        }: StatEntry,
        index: number,
    ) {
        if (requiresNegatives && !hasNegatives) {
            return;
        }

        const result: StatResult = calc();

        return (
            <View key={index} style={styles.statLine}>
                <View style={styles.singleStatEntry}>
                    <Text style={{ flexBasis: 300 }}>{`${title}${
                        isAbsolute && hasNegatives ? " (absolute)" : ""
                    }`}</Text>
                    <Text style={{ flexBasis: 150 }}>
                        {result.output.length > 0
                            ? numberString(result.output)
                            : "None"}
                    </Text>
                    <Text style={{ flexBasis: 300 }}>
                        {result.additionalText}
                    </Text>
                </View>
                <Divider />
            </View>
        );
    }

    function makeStatBlock(block: StatBlock, index: number) {
        return (
            <View style={styles.statBlock} key={index}>
                <Text variant="titleLarge">{block.title}</Text>
                {block.stats.map((stat, index) => makeStatLine(stat, index))}
            </View>
        );
    }

    function sortByValueAscending(a: number, b: number): number {
        return a < b ? -1 : 1;
    }

    function sortByValueDescending(a: number, b: number): number {
        return a > b ? -1 : 1;
    }

    /** @returns the total absolute sum of numbers pulled in a given grant */
    function absoluteSumForGrant(grant: Grant) {
        let total = 0;
        for (const [num, count] of grant.numberToCountMap) {
            total += Math.abs(num) * count;
        }
        return total;
    }

    // ------ STATS ------ //
    const records = [
        {
            title: "Largest number",
            calc: () => {
                const largest = sortedFlatPulls[sortedFlatPulls.length - 1];

                const rawOdds = Math.E ** (-(1 / 50) * largest);
                return {
                    output: [largest],
                    additionalText: `Odds of pulling a larger number: ${(
                        rawOdds * 100
                    ).toFixed(5)}%`,
                };
            },
        },
        {
            title: "Smallest number",
            requiresNegatives: true,
            calc: () => {
                const smallest = sortedFlatPulls[0];

                // Don't give up the fact that negatives exist quite yet
                if (smallest == 0) {
                    return { output: [smallest] };
                }

                const rawOdds = Math.E ** (-(1 / 50) * Math.abs(smallest));

                return {
                    output: [smallest],
                    additionalText: `Odds of pulling a smaller number: ${(
                        rawOdds *
                        100 *
                        (smallest < 0 ? 0.1 : 1)
                    ) // adjust for the odds of pulling a negative
                        .toFixed(5)}%`,
                };
            },
        },

        {
            title: "Days passed since highest pull",
            calc: () => {
                const grantWithHighestPull = getTimeBoundGrants().find(
                    (grant) =>
                        [...grant.numberToCountMap.keys()].includes(
                            sortedFlatPulls[sortedFlatPulls.length - 1],
                        ),
                );

                if (!grantWithHighestPull) {
                    return { output: [] };
                }

                const timeSince =
                    Date.now() - grantWithHighestPull.timestamp.getTime();

                const daysSince = Math.floor(timeSince / 1000 / 3600 / 24);

                return {
                    output: [daysSince],
                    additionalText: `${grantWithHighestPull.timestamp.toDateString()}`,
                };
            },
        },
        {
            title: "Highest total in one pull",
            isAbsolute: true,
            calc: () => {
                let largestGrant: Grant = getTimeBoundGrants()[0];

                for (const grant of getTimeBoundGrants()) {
                    const total = absoluteSumForGrant(grant);
                    if (total > absoluteSumForGrant(largestGrant)) {
                        largestGrant = grant;
                    }
                }
                return {
                    output: [absoluteSumForGrant(largestGrant)],
                    additionalText: getGrantString(largestGrant),
                };
            },
        },
        {
            title: "Lowest total in one pull",
            isAbsolute: true,
            calc: () => {
                let smallestGrant: Grant = getTimeBoundGrants()[0];

                for (const grant of getTimeBoundGrants()) {
                    const total = absoluteSumForGrant(grant);
                    if (total < absoluteSumForGrant(smallestGrant)) {
                        smallestGrant = grant;
                    }
                }
                return {
                    output: [absoluteSumForGrant(smallestGrant)],
                    additionalText: getGrantString(smallestGrant),
                };
            },
        },
    ];

    const duplicatesAndCopies = [
        {
            title: "Most frequently pulled number",
            calc: () => {
                let mostFrequentPull = [0];
                let mostFrequentCount = 0;
                for (const [num, count] of timeBoundNumberToCountMap()) {
                    if (count == mostFrequentCount) {
                        mostFrequentPull.push(num);
                    } else if (count > mostFrequentCount) {
                        mostFrequentPull = [num];
                        mostFrequentCount = count;
                    }
                }
                return {
                    output: mostFrequentPull,
                    additionalText: `Pulled ${mostFrequentCount} times`,
                };
            },
        },
        {
            title: "Largest duplicate number",
            calc: () => {
                let largestDuplicate = 0;
                let largestDuplicateCount = 0;
                for (const [num, count] of timeBoundNumberToCountMap()) {
                    if (count > 1 && num > largestDuplicate) {
                        largestDuplicate = num;
                        largestDuplicateCount = count;
                    }
                }
                return {
                    output: [largestDuplicate],
                    additionalText: `Pulled ${largestDuplicateCount} times`,
                };
            },
        },
        {
            title: "Most duplicates in a single pack",
            calc: () => {
                let mostDuplicatedNumbers: Set<number> = new Set();
                let mostDuplicateCount = 0;
                for (const grant of getTimeBoundGrants()) {
                    for (const [num, count] of grant.numberToCountMap) {
                        if (count == mostDuplicateCount) {
                            mostDuplicatedNumbers.add(num);
                        } else if (count > mostDuplicateCount) {
                            mostDuplicatedNumbers.clear();
                            mostDuplicatedNumbers.add(num);
                            mostDuplicateCount = count;
                        }
                    }
                }
                return {
                    output: [mostDuplicateCount],
                    additionalText: `${mostDuplicateCount} duplicates each of ${numberString(
                        [...mostDuplicatedNumbers].sort(sortByValueDescending),
                    )}`,
                };
            },
        },
        {
            title: "Largest total symmetric pair",
            requiresNegatives: true,
            calc: () => {
                /**
                 * Recursively "narrow down" on the largest symmetric pair someone has. This method
                 * iteratively swaps between testing a high number and a low number to jump to the
                 * next absolute largest number that might have a partner, then moves on.
                 */
                function narrowDown(testNumber: number) {
                    let lowBound: number;
                    let highBound: number;
                    if (testNumber < 0) {
                        lowBound = testNumber;
                        const res = [...sortedFlatPulls]
                            .reverse()
                            .find((val) => val <= Math.abs(lowBound));
                        if (res == undefined) {
                            return {
                                output: [],
                            };
                        }
                        highBound = res;
                    } else {
                        highBound = testNumber;
                        const res = sortedFlatPulls.find(
                            (val) => val >= highBound * -1,
                        );
                        if (res == undefined) {
                            return {
                                output: [],
                            };
                        }
                        lowBound = res;
                    }
                    if (Math.abs(lowBound) == highBound) {
                        return {
                            output: [lowBound, highBound],
                        };
                    } else {
                        return narrowDown(
                            testNumber < 0 ? highBound : lowBound,
                        );
                    }
                }

                return narrowDown(Math.min(...sortedFlatPulls));
            },
        },
    ];
    const pullingAndHowYouPull = [
        {
            title: "Total number of pulls",
            calc: () => ({
                output: [getTimeBoundGrants().length],
            }),
        },
        {
            title: "Total of all numbers pulled",
            isAbsolute: true,
            calc: () => {
                return {
                    output: [
                        getTimeBoundGrants().reduce(
                            (acc, curr) => acc + absoluteSumForGrant(curr),
                            0,
                        ),
                    ],
                };
            },
        },
        {
            title: "Total unique numbers pulled",
            calc: () => ({
                output: [[...timeBoundNumberToCountMap().keys()].length],
            }),
        },
        {
            title: "Longest total sequence",
            calc: () => {
                let currentSequence = [sortedFlatPulls[0]];
                let longestSequence = currentSequence;

                for (let i = 0; i < sortedFlatPulls.length - 1; i++) {
                    const curr = sortedFlatPulls[i];
                    const next = sortedFlatPulls[i + 1];

                    if (curr + 1 == next) {
                        currentSequence.push(next);
                    } else {
                        if (currentSequence.length > longestSequence.length) {
                            longestSequence = currentSequence;
                        }
                        // Reset the sequence to start with the number that broke the current
                        // sequence
                        currentSequence = [next];
                    }
                }
                return {
                    output: [longestSequence.length],
                    additionalText: `From ${longestSequence[0]} to ${
                        longestSequence[longestSequence.length - 1]
                    }`,
                };
            },
        },
        {
            title: "Narrowest spread in a single pack",
            calc: () => {
                let narrowestGrant = getTimeBoundGrants()[0];
                let narrowestDiff = Number.MAX_SAFE_INTEGER;

                for (const grant of getTimeBoundGrants()) {
                    const numbersInGrant = [
                        ...grant.numberToCountMap.keys(),
                    ].sort(sortByValueAscending);
                    const smallest = numbersInGrant[0];
                    const largest = numbersInGrant[numbersInGrant.length - 1];

                    const difference = largest - smallest;
                    if (difference < narrowestDiff) {
                        narrowestDiff = difference;
                        narrowestGrant = grant;
                    }
                }

                return {
                    output: [narrowestDiff],
                    additionalText: getGrantString(narrowestGrant),
                };
            },
        },
        {
            title: "Widest spread in a single pack",
            calc: () => {
                let widestGrant = getTimeBoundGrants()[0];
                let widestDiff = 0;

                for (const grant of getTimeBoundGrants()) {
                    const numbersInGrant = [
                        ...grant.numberToCountMap.keys(),
                    ].sort(sortByValueAscending);
                    const smallest = numbersInGrant[0];
                    const largest = numbersInGrant[numbersInGrant.length - 1];

                    const difference = largest - smallest;
                    if (difference > widestDiff) {
                        widestDiff = difference;
                        widestGrant = grant;
                    }
                }

                return {
                    output: [widestDiff],
                    additionalText: getGrantString(widestGrant),
                };
            },
        },
    ];
    const dimensions = [
        {
            title: "Completed rows of numbers",
            calc: () => {
                // The first possibly full row
                let rowStart = Math.ceil(sortedFlatPulls[0] / 10) * 10;
                let rowsCompleted = 0;
                function neededForFullRow(rowStart: number) {
                    return [...Array(10).keys()].map((x) => x + rowStart);
                }

                while (rowStart < sortedFlatPulls[sortedFlatPulls.length - 1]) {
                    if (
                        neededForFullRow(rowStart).every((x) =>
                            sortedFlatPulls.includes(x),
                        )
                    ) {
                        rowsCompleted += 1;
                    }
                    rowStart += 10;
                }

                return {
                    output: [rowsCompleted],
                };
            },
        },
        {
            title: "Completed columns of numbers",
            calc: () => {
                // The first possibly full column
                let columnStart = Math.ceil(sortedFlatPulls[0] / 100) * 100;
                let columnsCompleted = 0;
                function neededForFullColumn(columnStart: number) {
                    let arr = [];
                    for (let i = 0; i < 10; i++) {
                        arr.push(columnStart + i * 10);
                    }
                    return arr;
                }

                while (
                    columnStart < sortedFlatPulls[sortedFlatPulls.length - 1]
                ) {
                    for (let i = 0; i < 10; i++) {
                        if (
                            neededForFullColumn(columnStart + i).every((x) =>
                                sortedFlatPulls.includes(x),
                            )
                        ) {
                            columnsCompleted += 1;
                        }
                    }
                    columnStart += 100;
                }

                return { output: [columnsCompleted] };
            },
        },
    ];
    const moreStats = [
        {
            title: "Most value from duplicates of a single number",
            calc: () => {
                let highest = 0;
                let numAndCount: [number, number] = [0, 0];

                for (const [num, count] of timeBoundNumberToCountMap()) {
                    if (num * count > highest) {
                        highest = num * count;
                        numAndCount = [num, count];
                    }
                }

                return {
                    output: [highest],
                    additionalText: `You have pulled ${numAndCount[1]} of the number ${numAndCount[0]}, for a total value of ${highest}`,
                };
            },
        },
    ];
    /**
     * This mega-list contains all the stats we care about on this page. The methods in this list
     * should interact with the "time bound" lists for grants and numbers, not the raw ones we get
     * from useData.
     */
    const stats: StatBlock[] = [
        {
            title: "Records",
            stats: records,
        },
        { title: "Duplicates and copies", stats: duplicatesAndCopies },
        {
            title: "Pulling and how you pull",
            stats: pullingAndHowYouPull,
        },
        { title: "Dimensions", stats: dimensions },
        { title: "More stats", stats: moreStats },
    ];

    return (
        <View style={{ maxHeight: "100%" }}>
            <SegmentedButtons
                style={{ padding: 16 }}
                value={daysToConsider}
                onValueChange={setDaysToConsider}
                buttons={[
                    {
                        value: "0",
                        label: "All time",
                    },
                    { value: "14", label: "14 days" },
                    { value: "7", label: "7 days" },
                ]}
            />
            <ScrollView>
                <View style={styles.container}>
                    {stats.map((block, index) => makeStatBlock(block, index))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        gap: 8,
        padding: 16,
    },
    statLine: {
        gap: 8,
    },
    statBlock: {
        gap: 16,
        marginBottom: 8,
    },
    singleStatEntry: {
        flexDirection: "row",
        gap: 8,
    },
});
