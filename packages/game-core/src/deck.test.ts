import { describe, expect, it } from "vitest";

import { createDeck, createRng, deal, shuffle } from "./deck";

describe("deck", () => {
  it("creates 52 unique cards", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    const unique = new Set(deck.map((card) => `${card.rank}-${card.suit}`));
    expect(unique.size).toBe(52);
  });

  it("shuffles deterministically with seeded rng", () => {
    const deck = createDeck();
    const rng = createRng(42);
    const shuffled = shuffle(deck, rng);
    expect(shuffled).not.toEqual(deck);
    const rng2 = createRng(42);
    const shuffled2 = shuffle(deck, rng2);
    expect(shuffled).toEqual(shuffled2);
  });

  it("deals the requested number of cards", () => {
    const deck = createDeck();
    const { hand, remaining } = deal(deck, 5);
    expect(hand).toHaveLength(5);
    expect(remaining).toHaveLength(47);
    expect(hand[0]).toEqual(deck[0]);
  });
});
