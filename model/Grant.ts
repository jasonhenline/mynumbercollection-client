export type Grant = {
    timestamp: Date;
    numberToCountMap: Map<number, number>;
};

export function getGrantString(grant: Grant) {
    const numbers: number[] = [];
    for (const [number, count] of grant.numberToCountMap) {
        for (let i = 0; i < count; i++) {
            numbers.push(number);
        }
    }
    numbers.sort((a, b) => a - b);
    return numbers.join(", ");
}
