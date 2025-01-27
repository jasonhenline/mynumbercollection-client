import { convertToWords } from "react-number-to-words";

const numberToFlavorText = new Map<number, string>([
    [
        0,
        "The great void. Zero: the number that started it all… or did it? Neither positive nor negative, it’s just chillin’ in the middle.",
    ],
    [
        1,
        "The lone wolf of numbers. A true individualist—always standing alone yet multiplying anything into itself!",
    ],
    [
        2,
        "The dynamic duo. The smallest prime number and the very essence of balance. It’s odd to be this even.",
    ],
    [
        3,
        "Triumphant trio! The first odd prime number. A favorite for triangles, tridents, and troublemakers.",
    ],
    [
        4,
        "Square deal! The result of 2×2. Strong, reliable, and a little bit square. Literally.",
    ],
    [
        5,
        "High five! The number of fingers on a hand and the friendliest digit around. Also, primes love this one.",
    ],
    [
        6,
        "The perfect number… mathematically speaking. Divisible by 1, 2, and 3, it’s just that cool.",
    ],
    [
        7,
        "Lucky number seven! Prime and mysterious, it’s been winning lotteries and hearts since forever.",
    ],
    [
        8,
        "Eight is great! Two cubed and the basis of octopus admiration worldwide. Seriously, who doesn’t love an octopus?",
    ],
    [
        9,
        "Squared away. Three times three equals nine! Watch out, it’s starting to feel exponential in here.",
    ],
    [
        10,
        "The Big Ten. A decimal darling and the cornerstone of human counting systems. Can’t stop this power of ten!",
    ],
    [
        11,
        "The palindrome prime! Reads the same forward and backward, just like it’s showing off in the mirror.",
    ],
    [
        12,
        "A dozen delights! Perfect for eggs, donuts, and dividing into thirds.",
    ],
    [13, "Unlucky for some, but a prime number powerhouse!"],
    [
        14,
        "Double seven, but only half the luck? A composite number with a heart of gold.",
    ],
    [
        15,
        "The quarter-hour king. A multiple of 3 and 5, and every clock’s best friend. Tick-tock!",
    ],
    [
        16,
        "Sweet sixteen! A perfect square (4×4) and the foundation of hexadecimal adventures.",
    ],
    [
        17,
        "Prime and sublime. 17 is mysterious, slightly aloof, and definitely cooler than the other teens.",
    ],
    [
        18,
        "A multiple of everything! Okay, not really, but divisible by 1, 2, 3, 6, and 9. A true team player.",
    ],
    [
        19,
        "Prime and on the brink of twenty. It’s like 19 is teetering between youth and adulthood in number years.",
    ],
    [
        20,
        "Score! Two tens rolled into one. Whether you’re counting fingers, toes, or years, 20 is a milestone.",
    ],
    [
        21,
        "Lucky blackjack! The life of the party and a multiple of 3 and 7. It’s got charisma and math cred.",
    ],
    [
        22,
        "Double trouble—or double fun? A palindrome that’s even, balanced, and twice as nice.",
    ],
    [
        23,
        "Michael Jordan’s number, a prime, and the most iconic two-three combo since peanut butter and jelly.",
    ],
    [
        24,
        "24/7 versatility! Divisible by 1, 2, 3, 4, 6, 8, and 12. This number doesn’t take a day off.",
    ],
    [
        25,
        "Square up! Five times five equals twenty-five. The perfect square with an eye on the prize.",
    ],
    [
        26,
        "Two baker’s dozens minus a little frosting. Not a prime, but still in its prime. It’s just vibin’.",
    ],
    [
        27,
        "Cubed chaos! Three times three times three. This number’s got layers—like an onion or a parfait.",
    ],
    [
        28,
        "Another perfect number! Divisors add up to itself (1 + 2 + 4 + 7 + 14 = 28). It’s mathematically flawless.",
    ],
    [
        29,
        "Prime and proud! 29 is independent, indivisible, and always marching to its own rhythm.",
    ],
    [
        30,
        "Dirty thirty? More like dazzling thirty! A multiple of 2, 3, and 5, it’s the ultimate party organizer.",
    ],
    [
        31,
        "Prime and thriving! A number that says, ‘Who needs factors when I’ve got personality?",
    ],
    [
        32,
        "Power up! Two to the fifth power (2×2×2×2×2). It’s exponential excitement packed into a tidy number.",
    ],
    [
        33,
        "Double threes, twice the charm! A multiple of 3 and 11, it’s basically a math matchmaker.",
    ],
    [
        34,
        "A Fibonacci favorite! Found in the famous sequence, it’s got growth potential and good vibes.",
    ],
    [
        35,
        "Triple seven’s cousin. A product of 5×7, it’s keeping things odd yet harmonious.",
    ],
    [
        36,
        "Squared and sensational! Six times six equals thirty-six. A perfect square, perfect symmetry.",
    ],
    [37, "Strong, independent, and totally unique—37 does its own thing."],
    [
        38,
        "A little shy of forty but still great! Even, reliable, and the sum of 19 + 19. Double your 19 fun!",
    ],
    [
        39,
        "The first multiple of 3 to flirt with forty. Prime? Nope. Fun? Absolutely. A 3 and 13 combo!",
    ],
    [
        40,
        "Forty and fabulous! A multiple of 2, 4, 5, and 10, it’s a master of division and milestones.",
    ],
    [42, "Don't Panic."],
    [69, "Nice."],
    [86, "Eighty-six that number chef! Yes chef!"],
    [
        88,
        "If my calculations are correct, when this baby hits eighty-eight... you're gonna see some serious stuff.",
    ],
    [101, "Intro to Number Plucking."],
    [127, "The number is coming from... inside the house?"],
    [301, "See flavor text 302."],
    [302, "See flavor text 301."],
    [314, "...15926535..."],
    [359, "This game has almost come full circle."],
    [404, "Flavor text not found."],
    [418, "I'm a teapot."],
]);

export function getFlavorText(number: number): string {
    const creativeFlavorText = numberToFlavorText.get(number);
    if (creativeFlavorText) {
        return creativeFlavorText;
    }
    return (
        (number < 0 ? "Negative " : "") + convertToWords(Math.abs(number), "")
    );
}
