Poker Game Monorepo Setup
Why React Native + React Native Web (not Capacitor)

Capacitor = WebView wrapper → bad for 60fps animations, gestures, haptics.

React Native = real native performance, with react-native-web for browser build.

Lets us share UI components, animations, and game logic across mobile and web.

Monorepo Structure
poker/
  apps/
    native/        # Expo app (iOS / Android)
    web/           # Next.js app (SSR, SEO, devtools)
  packages/
    ui/            # Shared RN components (cards, chips, table, etc.)
    game-core/     # Pure TS game logic (deck, shuffle, hand eval, table state)
    animations/    # Shared animation helpers (Reanimated, Moti, curves)
    assets/        # Fonts, card sprites, chip graphics, sounds
    config/        # Shared ESLint, TS, Prettier, base tsconfig
  turbo.json
  package.json


Use Turborepo + pnpm or yarn workspaces for monorepo.

Aliases in tsconfig.json for @ui/*, @game-core/*, etc.

Tech Stack

Mobile: Expo (React Native + Reanimated, Gesture Handler, Skia, Haptics, AV)

Web: Next.js + react-native-web (or Expo Web)

Animations: Reanimated 3 (+ Moti sugar). GPU with Skia if needed.

Graphics: RN Skia (GPU shaders, glow) or RN SVG for scalable cards/icons.

Gestures: react-native-gesture-handler for drag, flick, long press.

Theming: @shopify/restyle, Tamagui, or custom design tokens.

Sounds: expo-av for chip clacks, card flip, background music.

State & Logic: Pure TS inside game-core (deterministic RNG, hand evaluator, seat management).

Networking (later): WebSocket layer (Colyseus or raw WS).

Minimum Viable Demo (MVP to Impress)

Poker Table Screen (6 seats + dealer button).

Dealing Animation (fan cards from deck to seats).

Chip Stack Animation (stack grows/shrinks, slide bet to pot with bounce).

Hand Evaluator (TS module with unit tests).

Theming Toggle (Casino Night vs Neon Tech).

Haptics + Sound (light impact on card tap, chip clack).

Web Build with Next.js SSR using the same RN components.

Roadmap / README Story

Diagram of monorepo sharing.

Roadmap: multiplayer sync, accessibility (screen readers), RTL support.

👉 Goal: Single monorepo, shared game logic + UI, platform-specific polish via Platform.select. Native performance on mobile, SSR on web. Perfect to showcase UI/UX + animation skills.