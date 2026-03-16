# Publish to GitHub & npm

## 1. GitHub push

```bash
git add .
git commit -m "feat: monorepo (pnpm + turbo), react-native-tweet package, Expo example app"
git push -u origin main
```

If you haven't set the remote yet:

```bash
git remote add origin https://github.com/ertugrulemrecihan/react-native-tweet.git
git branch -M main
git push -u origin main
```

## 2. npm publish (react-native-tweet package)

Publish only the library in `packages/react-native-tweet` (not the monorepo root or the example app).

```bash
# 1. Build the package
cd packages/react-native-tweet
pnpm install
pnpm run build

# 2. Log in to npm (once)
npm login

# 3. Publish (use --access public if the package name is scoped, e.g. @username/react-native-tweet)
npm publish
```

If the name `react-native-tweet` is taken on npm, use a scoped name in `packages/react-native-tweet/package.json`:

```json
"name": "@YOUR_NPM_USERNAME/react-native-tweet"
```

Then publish with:

```bash
npm publish --access public
```

## 3. Bumping versions later

1. Update `version` in `packages/react-native-tweet/package.json` (e.g. `1.0.1`).
2. Update `packages/react-native-tweet/CHANGELOG.md`.
3. From repo root: `pnpm build`, then `cd packages/react-native-tweet && npm publish`.
