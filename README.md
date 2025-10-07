# Poker UI/Animation Showcase

This project is a monorepo that highlights a cross‑platform animation system built with Expo (React Native) and Next.js. It was designed as a visual demo for interactive poker table UI, focusing on smooth animations, deterministic game state, and a shared design system.

## Project Goals

- **Consistent Poker Table UI** on native iOS/Android (via Expo) and web (via Next.js).
- **Animation showcase**: typewriter intro, welcome overlay, card dealing, chip movement.
- **Shared logic**: all game primitives live in `packages/game-core`.
- **Strict TypeScript** and lean component boundaries.

## Repository Layout

```
poker/
├── apps/
│   ├── native/          # Expo managed app (SDK 54 / RN 0.81)
│   └── web/             # Next.js app (React 19 + react-native-web)
├── packages/
│   ├── ui/              # Shared React/React Native components
│   ├── game-core/       # Deterministic poker logic and helpers
│   └── animations/      # Reanimated hooks and primitives
├── README.md
├── package.json         # Root workspace config
└── turbo.json           # Turborepo pipeline
```

## Requirements

- Node 18+ and pnpm 9 (`corepack enable` is recommended).
- Xcode or Android Studio for native device builds (optional).
- Expo CLI (bundled via `npx expo …`).
- Next.js 15 for web.

## Getting Started

Install once at the root:

```bash
pnpm install
```

### Web

```bash
pnpm --filter poker-web dev   # runs Next.js on localhost:3000
```

### Native (Expo)

```bash
pnpm --filter poker-native dev   # runs Expo on localhost:19000
```

Scan the QR code with the SDK 54 Expo Go build *or* install the dev client if you need additional native modules.

## Key Features

- **Welcome overlay with typewriter animation** on both web and native (CSS animation for web, Reanimated for mobile).
- **Poker table demo** showing shared seat layout, card dealing, chip movement, and betting buttons.
- **Design tokens** under `packages/ui/src/theme/tokens.ts` to keep spacing, colors, and radii consistent.
- **Deterministic game logic** inside `packages/game-core`, enabling repeatable deals and unit tests.

## Commands

At the root:

```bash
pnpm dev         # runs both app dev commands via Turborepo
pnpm build       # builds both apps
pnpm typecheck   # runs TypeScript for all packages
pnpm lint        # ESLint across the monorepo
```

Per app, see the scripts inside:

- `apps/native/package.json`
- `apps/web/package.json`

## Native Run Notes

- Expo SDK 54 uses React Native 0.81.4; ensure Expo Go or your dev client matches.
- If you add third‑party native modules, install `expo-dev-client`, rebuild with `expo run:ios`/`run:android`, and use the custom dev build.

## Web Run Notes

- The web app uses `@expo/next-adapter` to align React Native styling with Next.js.
- Regenerate `.next` on each dependency change with `pnpm --filter poker-web dev -- --clear`.

## Testing

- Unit tests live in `packages/game-core` with Vitest (see `pnpm --filter @game-core test`).
- Use React Native Testing Library / Playwright for UI testing (not yet configured).

## License

This demo code is unlicensed; adapt it for your motion/UX showcase. Replace dependencies (e.g., Skia) as needed for production deployments.
