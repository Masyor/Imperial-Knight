export interface TapestryPanel {
  id: string;
  title: string;
  latin: string;
  image: string;
  lore: string;
}

export interface Deed {
  id: string;
  battleName: string;
  foesDefeated: string;
  knightDeed: string;
  stardate: string;
  isCustom?: boolean;
}

export interface ChivalricVow {
  knightClass: string;
  quest: string;
  vow: string;
  signature: string;
  dateSigned: string;
}
