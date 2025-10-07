# AGENTS.md

Purpose: define how we build the poker MVP. Keep it simple, fast, and consistent across native and web. No bloat. Ship.

## Ground Rules

* Cross-platform primitives only: React Native components everywhere, `react-native-web` on web.
* Single source of truth for logic: `packages/game-core`.
* Animations are functional, short, and 60 fps. No micro-animation rabbit holes.
* Prefer composition over configuration. Small components > giant prop objects.
* No new libraries unless they replace >50 lines of custom code or solve perf.
* Always read the files again before re-iterating something on them because i will do manual changes here and there.

## Tech Recap

* Mobile: Expo + RN, Reanimated, Gesture Handler, Skia, Haptics, AV.
* Web: Next.js + react-native-web.
* Shared: `packages/ui`, `packages/game-core`, `packages/animations`, `packages/assets`.

## Definition of Done (MVP)

* 6-seat table, dealer button, cards deal to seats, chips move to pot.
* Theme toggle: Casino Night vs Neon Tech.
* Haptics on important taps; chip/card sounds.
* Same UI runs on native and web.
* Unit tests for hand evaluator and deck.
* No crash, no redboxes, 60 fps on a mid Android device and desktop Chrome.

---

## File Boundaries

* `apps/native`: screens, navigation, native bootstrapping.
* `apps/web`: pages, Next entry, SSR wiring.
* `packages/ui`: presentational components and small hooks only.
* `packages/game-core`: pure TS, no React, no I/O, deterministic.
* `packages/animations`: reusable Reanimated primitives.
* `packages/assets`: fonts, sprites, sounds.

Do not leak app code into packages. Packages must be importable in isolation.

---

## Component Rules

* Keep files < 200 lines. Split early.
* Props: required minimal shape. No prop drilling chains; lift shared state up one level.
* Styling: inline RN styles or a small tokens util. No CSS-in-JS bloat.
* Platform fork only when unavoidable:

  ```ts
  import { Platform } from "react-native";
  const shadow = Platform.select({ ios: { shadowOpacity: 0.2 }, default: { elevation: 3 } });
  ```
* Accessibility: every pressable gets `accessibilityRole="button"` and a label.

---

## State Management

* Local UI state with `useState` and `useReducer`.
* Game state in `game-core` as serializable objects and pure functions.
* Screen glue does translation:

  * UI event -> intent -> `game-core` reducer -> new state -> render.
* No external state libs in MVP.

---

## Animations

* Reanimated only for motion; Moti allowed for sugar in MVP if it speeds you up.
* Durations: 150 to 450 ms. Easing: standard bezier or spring preset.
* Do not animate layout with JS. Use Reanimated shared values.
* Chip move example pattern:

  ```ts
  // pseudo
  const x = useSharedValue(0); const y = useSharedValue(0);
  useEffect(() => { withTiming(x, potX); withTiming(y, potY); }, [potX, potY]);
  ```
* Skia is optional. Use it only for meaningful gain (glow, trails).

---

## Sounds & Haptics

* `expo-av` for sfx. Preload on first screen. Debounce repeats.
* `expo-haptics` on major events only: deal, bet, win.

---

## Game Core Rules

* No randomness without a seed. Provide `rng(seed)` for deterministic tests.
* Pure functions:

  * `createDeck(seed)`, `shuffle(deck, seed)`, `deal(deck, n)`, `evaluateHand(cards)`
  * `step(state, intent)` -> `state`
* Shapes are immutable. Avoid classes. Return new objects.
* Hand evaluator must be O(n) over 7 cards with fixed small constants.

---

## Networking (stub for MVP)

* No real backend. Simulate with local bots and a simple event bus.
* Abstract I/O behind an interface so we can swap WS later:

  ```ts
  export interface Transport { send<T>(ev: string, msg: T): void; on(ev: string, cb: Fn): Unsub; }
  ```

---

## Performance Budget

* Cold start: < 2.5s on Android mid-range.
* First interaction: < 100 ms.
* 60 fps on dealing and chip movement. Profilers must be clean.
* Images: prefetch sprites; use `Image` with fixed sizes. No layout thrash.

---

## Error Handling

* Never throw in render.
* Guard external inputs. Fail closed:

  ```ts
  if (!isValidBet(input)) return;
  ```
* Log with a tiny wrapper that can be replaced later:

  ```ts
  export const log = { info: console.log, warn: console.warn, error: console.error };
  ```

---

## Theming & Tokens

* Keep a small tokens map:

  ```ts
  export const tokens = {
    radius: { sm: 6, md: 12, lg: 20 },
    color: { bg: "#0a0f14", accent: "#00ffd1", chip: "#ffd166" },
    space: { xs: 4, sm: 8, md: 12, lg: 16 }
  };
  ```
* Theme switch is just a different tokens object. No giant theme engines.

---

## Testing

* `game-core`: vitest. Aim for 70 percent on evaluator and deck.
* UI: minimal. Snapshot the table once and call it a day for MVP.
* Do not test Reanimated internals.

---

## Code Style

* TypeScript strict. No `any`.
* No default exports. Named exports only.
* Prefer small pure helpers over utils dumping ground.
* Keep import paths aliased via `@ui/*`, `@game-core/*`, `@animations/*`.

---

## Assets

* Cards: vector or 2x sprite sheets. One import point in `packages/assets`.
* Sounds: short, normalized, under 100 kb each. MP3 or AAC.

---

## PR Checklist

* Does it run on native and web?
* No new deps unless justified in the PR description.
* Game logic is pure and tested.
* Animations use Reanimated shared values.
* No platform-specific hacks without a comment.
* Build passes: `dev`, `build`, `typecheck`, `lint`.

---

## Copilot/Codex Prompt Recipes

* Scaffold package:

  ```
  In packages/game-core, create a pure TS hand evaluator for Texas Hold'em.
  Inputs: 7 cards. Output: rank enum and kickers.
  Deterministic, no side effects. Write unit tests for all hand types.
  ```
* Deal animation:

  ```
  In packages/ui, create a <DealFan /> that animates a card from deck to a seat
  using Reanimated shared values. 250 ms per card, 50 ms stagger. Works web/native.
  ```
* Chip slide:

  ```
  Create <ChipStack /> with a moveToPot(potX, potY) method using withTiming springs.
  Keep component under 150 lines. No Skia. Provide a minimal demo in apps/native.
  ```
* Theme toggle:

  ```
  Implement a simple tokens switcher with two themes. No theme libs.
  Expose useTokens() hook consumed by <Table />, <Card />, <ChipStack />.
  ```

---

## Anti-Patterns to Block

* Web-only or native-only components inside `packages/ui`.
* Game logic written as React hooks.
* Long component files, giant prop bags.
* Animations driven by React state or setTimeout.
* Adding Redux, Zustand, or TanStack Query in MVP.

---

## Roadmap After MVP

* Real WS transport, presence, table sync.
* Skia polish: glow, shader trails on card deal.
* Spectator mode, replays, telemetry.

Build the table, deal cards, move chips. Ship first, fancy later.
