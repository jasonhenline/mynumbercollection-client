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
