import { isPrime } from "./math";

{
    const primesBelow100 = new Set([
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
        71, 73, 79, 83, 89, 97,
    ]);

    const range = Array.from({ length: 201 }, (_, i) => i - 100);
    test.each(range)("isPrime(%i)", (n) =>
        expect(isPrime(n)).toEqual(primesBelow100.has(n)),
    );
}
