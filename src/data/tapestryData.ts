import { TapestryPanel } from '../types';

const img1 = new URL('../assets/images/1.png', import.meta.url).href;
const img2 = new URL('../assets/images/2.png', import.meta.url).href;
const img3 = new URL('../assets/images/3.png', import.meta.url).href;
const img4 = new URL('../assets/images/4.png', import.meta.url).href;
const img5 = new URL('../assets/images/5.png', import.meta.url).href;

export const TAPESTRY_PANELS: TapestryPanel[] = [
  {
    id: "panel-1",
    title: "I. A Ship",
    latin: "SOME LATIN WORDS",
    image: img1,
    lore: "Write a little story."
  },
  {
    id: "panel-2",
    title: "II. A Goober",
    latin: "SOME LATIN WORDS",
    image: img2,
    lore: "Look at this little goober, he so funny."
  },
  {
    id: "panel-3",
    title: "III. Goober King",
    latin: "SOME LATIN WORDS",
    image: img3,
    lore: "Oh he has a chair now? Maybe he is some kind of king?"
  },
  {
    id: "panel-4",
    title: "IV. Wot Dat?",
    latin: "SOME LATIN WORDS",
    image: img4,
    lore: "What even is this?"
  },
  {
    id: "panel-5",
    title: "V. Guardsmen",
    latin: "SOME LATIN WORDS",
    image: img5,
    lore: "Just some guys being dudes."
  }
];
