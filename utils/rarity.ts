export enum Rarity {
  Trash,
  Common,
  Uncommon,
  Rare,
  Mythical,
  Legendary,
  Unique,
}

export function getCardRarity(number: number): Rarity {
  const abs = number >= 0 ? number : -(number + 1);
  // Special case -1 as Common due to two's compliment making it 0
  if (number == -1) {
    return Rarity.Common;
  }

  if (abs >= 0 && abs < 100) {
    return Rarity.Common;
  } else if (abs >= 100 && abs < 200) {
    return Rarity.Uncommon;
  } else if (abs >= 200 && abs < 300) {
    return Rarity.Rare;
  } else if (abs >= 300 && abs < 400) {
    return Rarity.Mythical;
  } else if (abs >= 400 && abs < 500) {
    return Rarity.Legendary;
  } else {
    return Rarity.Unique;
  }
}
