import { Rarity, getCardRarity } from "@/utils/rarity";

export type CardColor = {
  background: string;
  foreground: string;
};

function rarityColor(rarity: Rarity): string {
  switch (rarity) {
    case Rarity.Trash:
      return "#eeeeee";
    case Rarity.Common:
      return "#999999";
    case Rarity.Uncommon:
      return "#00c400";
    case Rarity.Rare:
      return "#6d9eeb";
    case Rarity.Mythical:
      return "#ffe599";
    case Rarity.Legendary:
      return "#e69138";
    case Rarity.Unique:
      return "#ff00ff";
  }
}

// The below colors are not themed, because they are a core part of
// the existing visual identity of the app.
export function getCardColor(number: number): CardColor {
  const rarity = getCardRarity(number);
  const color = rarityColor(rarity);

  // Invert card colors for negative numbers
  if (number >= 0) {
    return { background: color, foreground: "#000000" };
  } else {
    return { background: "#000000", foreground: color };
  }
}
