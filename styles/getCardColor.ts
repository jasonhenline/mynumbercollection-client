import { Rarity, getCardRarity } from "@/utils/rarity";

export type CardColor = {
  background: string;
  foreground: string;
};

function cardBackgroundColor(rarity: Rarity): string {
  switch (rarity) {
    case Rarity.Trash:
      return "#999999";
    case Rarity.Common:
      return "hsl(130, 60%, 46%)";
    case Rarity.Uncommon:
      return "hsl(220, 60%, 46%)";
    case Rarity.Rare:
      return "hsl(280, 60%, 46%)";
    case Rarity.Mythical:
      return "hsl(40, 60%, 46%)";
    case Rarity.Legendary:
      return "hsl(10, 60%, 46%)";
    case Rarity.Unique:
      return "hsl(190, 60%, 46%)";
  }
}

function gridBackgroundColor(rarity: Rarity): string {
  switch (rarity) {
    case Rarity.Trash:
      return "#999999";
    case Rarity.Common:
      return "hsl(130, 60%, 26%)";
    case Rarity.Uncommon:
      return "hsl(220, 60%, 26%)";
    case Rarity.Rare:
      return "hsl(280, 60%, 26%)";
    case Rarity.Mythical:
      return "hsl(40, 60%, 26%)";
    case Rarity.Legendary:
      return "hsl(10, 60%, 26%)";
    case Rarity.Unique:
      return "hsl(190, 60%, 26%)";
  }
}

function negativeBackgroundColor(rarity: Rarity): string {
  switch (rarity) {
    case Rarity.Trash:
      return "#999999";
    case Rarity.Common:
      return "hsl(130, 60%, 6%)";
    case Rarity.Uncommon:
      return "hsl(220, 60%, 6%)";
    case Rarity.Rare:
      return "hsl(280, 60%, 6%)";
    case Rarity.Mythical:
      return "hsl(40, 60%, 6%)";
    case Rarity.Legendary:
      return "hsl(10, 60%, 6%)";
    case Rarity.Unique:
      return "hsl(190, 60%, 6%)";
  }
}

// The below colors are not themed, because they are a core part of
// the existing visual identity of the app.
export function getCardColor(number: number): CardColor {
  const rarity = getCardRarity(number);
  const cardColor = cardBackgroundColor(rarity);
  const negativeColor = negativeBackgroundColor(rarity);

  // Invert card colors for negative numbers
  if (number >= 0) {
    return { background: cardColor, foreground: "#000000" };
  } else {
    return { background: negativeColor, foreground: "#ffffff" };
  }
}

export function getGridColor(number: number): CardColor {
  const rarity = getCardRarity(number);
  const cardColor = cardBackgroundColor(rarity);
  const gridColor = gridBackgroundColor(rarity);
  const negativeColor = negativeBackgroundColor(rarity);

  // Invert card colors for negative numbers
  if (number >= 0) {
    return { background: gridColor, foreground: "#ffffff" };
  } else {
    return { background: negativeColor, foreground: "#ffffff" };
    // return { background: "#000000", foreground: cardColor };
  }
}
