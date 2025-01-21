// The below colors are not themed, because they are a core part of
// the existing visual identity of the app.
export function getCardColor(number: number): string {
    return number >= 0 ? "green" : "firebrick";
}