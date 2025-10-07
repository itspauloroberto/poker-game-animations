export type Suit = "clubs" | "diamonds" | "hearts" | "spades";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K" | "A";

export type Card = {
  rank: Rank;
  suit: Suit;
};

const suits: Suit[] = ["clubs", "diamonds", "hearts", "spades"];
const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
};

export type RNG = () => number;

export const createRng = (seed: number): RNG => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
};

export const shuffle = (cards: Card[], rng: RNG): Card[] => {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const deal = (deck: Card[], count: number): { hand: Card[]; remaining: Card[] } => {
  const hand = deck.slice(0, count);
  const remaining = deck.slice(count);
  return { hand, remaining };
};
