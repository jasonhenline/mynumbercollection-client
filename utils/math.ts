export function isPrime(number: number): boolean {
  const root = Math.sqrt(number);
  const absNumber = Math.abs(number);
  if (absNumber == 0) {
    return false;
  }
  for (let divisor = 2; divisor <= root; divisor++) {
    if (absNumber % divisor == 0) {
      return false;
    }
  }
  return true;
}

export function isSquare(number: number): boolean {
  const absNumber = Math.abs(number);
  if (absNumber == 0) {
    return false;
  }
  return Number.isInteger(Math.sqrt(absNumber));
}
