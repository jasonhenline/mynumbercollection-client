export function isPrime(number: number): boolean {
    if (number <= 1) {
        return false;
    }
    if (number == 2) {
        return true;
    }
    if (number % 2 == 0) {
        return false;
    }
    const root = Math.sqrt(number);
    for (let divisor = 3; divisor <= root; divisor += 2) {
        if (number % divisor == 0) {
            return false;
        }
    }
    return true;
}

export function isSquare(number: number): boolean {
    const absNumber = Math.abs(number);
    return Number.isInteger(Math.sqrt(absNumber));
}

function isPerfectSquare(n: number): boolean {
    const s = Math.sqrt(n);
    return s === Math.floor(s);
}

export function isFibonacci(number: number): boolean {
    if (number < 0) return false;
    const n5 = 5 * number * number;
    return isPerfectSquare(n5 + 4) || isPerfectSquare(n5 - 4);
}

function properDivisors(n: number): number[] {
    if (n <= 1) return [];
    const divisors = [1];
    const root = Math.sqrt(n);
    for (let i = 2; i <= root; i++) {
        if (n % i === 0) {
            divisors.push(i);
            if (i !== n / i) {
                divisors.push(n / i);
            }
        }
    }
    return divisors;
}

function sumOfProperDivisors(n: number): number {
    return properDivisors(n).reduce((sum, d) => sum + d, 0);
}

function isSemiperfect(n: number): boolean {
    const divs = properDivisors(n);
    const dp = new Set<number>([0]);
    for (const d of divs) {
        const toAdd: number[] = [];
        for (const s of dp) {
            const next = s + d;
            if (next === n) return true;
            if (next < n) toAdd.push(next);
        }
        for (const v of toAdd) dp.add(v);
    }
    return false;
}

export type CollectionType =
    | "fibonacci"
    | "squares"
    | "primes"
    | "perfect"
    | "abundant"
    | "semiperfect"
    | "weird"
    | "untouchable";

export function isInSequence(type: CollectionType, n: number): boolean {
    switch (type) {
        case "fibonacci":
            return isFibonacci(n);
        case "squares":
            return isSquare(n);
        case "primes":
            return isPrime(n);
        case "perfect":
            return n > 0 && sumOfProperDivisors(n) === n;
        case "abundant":
            return n > 0 && sumOfProperDivisors(n) > n;
        case "semiperfect":
            return n > 0 && isSemiperfect(n);
        case "weird":
            return n > 0 && sumOfProperDivisors(n) > n && !isSemiperfect(n);
        case "untouchable":
            return false;
    }
}

export function generateSequence(
    type: CollectionType,
    maxNumber: number,
): number[] {
    switch (type) {
        case "fibonacci":
            return generateFibonacciUpTo(maxNumber);
        case "squares":
            return generateSquaresUpTo(maxNumber);
        case "primes":
            return generatePrimesUpTo(maxNumber);
        case "perfect":
            return generatePerfectUpTo(maxNumber);
        case "abundant":
            return generateByFilter(maxNumber, (n) => sumOfProperDivisors(n) > n);
        case "semiperfect":
            return generateByFilter(maxNumber, isSemiperfect);
        case "weird":
            return generateByFilter(
                maxNumber,
                (n) => sumOfProperDivisors(n) > n && !isSemiperfect(n),
            );
        case "untouchable":
            return generateUntouchableUpTo(maxNumber);
    }
}

function generateFibonacciUpTo(maxNumber: number): number[] {
    const fibs: number[] = [0, 1];
    let a = 0;
    let b = 1;
    while (b <= maxNumber) {
        const next = a + b;
        a = b;
        b = next;
        fibs.push(b);
    }
    return fibs;
}

function generateSquaresUpTo(maxNumber: number): number[] {
    const squares: number[] = [];
    for (let i = 0; i * i <= maxNumber; i++) {
        squares.push(i * i);
    }
    const next = squares.length;
    squares.push(next * next);
    return squares;
}

function generatePrimesUpTo(maxNumber: number): number[] {
    const primes: number[] = [];
    for (let i = 2; i <= maxNumber; i++) {
        if (isPrime(i)) primes.push(i);
    }
    for (let i = maxNumber + 1; ; i++) {
        if (isPrime(i)) {
            primes.push(i);
            break;
        }
    }
    return primes;
}

function generatePerfectUpTo(maxNumber: number): number[] {
    const known = [6, 28, 496, 8128, 33550336];
    const result = known.filter((n) => n <= maxNumber);
    const next = known.find((n) => n > maxNumber);
    if (next !== undefined) result.push(next);
    return result;
}

function generateByFilter(
    maxNumber: number,
    predicate: (n: number) => boolean,
): number[] {
    const results: number[] = [];
    for (let i = 1; i <= maxNumber; i++) {
        if (predicate(i)) results.push(i);
    }
    for (let i = maxNumber + 1; results.length === 0 || i <= maxNumber + 1000; i++) {
        if (predicate(i)) {
            results.push(i);
            break;
        }
    }
    return results;
}

function generateUntouchableUpTo(maxNumber: number): number[] {
    const bound = Math.max(maxNumber * 2, 1000);
    const touchable = new Set<number>();
    for (let m = 2; m <= bound; m++) {
        touchable.add(sumOfProperDivisors(m));
    }
    const results: number[] = [];
    for (let i = 2; i <= maxNumber; i++) {
        if (!touchable.has(i)) results.push(i);
    }
    for (let i = maxNumber + 1; i <= maxNumber + 1000; i++) {
        if (!touchable.has(i)) {
            results.push(i);
            break;
        }
    }
    return results;
}
