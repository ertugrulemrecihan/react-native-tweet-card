# react-native-tweet

Monorepo for the **react-native-tweet** library and example app. Tweet embed for React Native / Expo using the same Twitter Syndication API as [vercel/react-tweet](https://github.com/vercel/react-tweet) (MIT).

## Structure

- **`packages/react-native-tweet`** – npm library (embed tweets in React Native)
- **`apps/expo-app`** – Example Expo app using the library

## Setup

```bash
pnpm install
```

## Commands

| Command | Description |
|--------|-------------|
| `pnpm build` | Build all packages (library output in `packages/react-native-tweet/dist`) |
| `pnpm dev` | Watch mode for the library |
| `pnpm start` | Run all apps (e.g. Expo) |
| `pnpm lint` | Lint all workspaces |

## Run the example app

```bash
pnpm install
pnpm build
cd apps/expo-app && pnpm start
```

(You can remove the old `examples/` folder; the app now lives in `apps/expo-app`.)

## Using the library

From another app in the monorepo, depend on `react-native-tweet` with `workspace:*`.  
From npm: `npm install react-native-tweet`. See [packages/react-native-tweet/README.md](packages/react-native-tweet/README.md) for API and usage.

## Tooling

- **pnpm** – workspace package manager  
- **Turborepo** – task runner and caching  
- **Changesets** – versioning and changelogs (optional)

## License

MIT. See [packages/react-native-tweet/LICENSE](packages/react-native-tweet/LICENSE).
