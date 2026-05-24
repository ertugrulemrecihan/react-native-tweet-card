# react-native-tweet-card

Embed tweets in React Native with a drop-in tweet card component and hooks. Uses the same Twitter Syndication API as [vercel/react-tweet](https://github.com/vercel/react-tweet) (MIT); no backend required.

## Install

```bash
npm install react-native-tweet-card react-native-svg
```

**Peer dependencies:** `react`, `react-native`, `react-native-svg`.

**Optional Expo integrations:** `expo-image`, `expo-web-browser`.

## Usage

```tsx
import { Tweet } from 'react-native-tweet-card';

// By tweet ID
<Tweet id="1234567890" />;

// Hook + custom UI
import {
  useTweet,
  TweetCard,
  TweetSkeleton,
  enrichTweet,
} from 'react-native-tweet-card';

function MyTweet({ id }: { id: string }) {
  const { data, isLoading, error } = useTweet(id);
  const enriched = data ? enrichTweet(data) : null;
  if (isLoading) return <TweetSkeleton />;
  if (!enriched) return <Text>Unavailable</Text>;
  return <TweetCard tweet={enriched} />;
}
```

## API

- `Tweet` - Component that takes `id` and renders card, skeleton, or not-found.
- `TweetCard` - Renders an enriched tweet.
- `TweetSkeleton` - Loading placeholder.
- `useTweet(id)` - Hook: `{ data, error, isLoading, refetch }`.
- `getTweet(id)`, `fetchTweet(id)` - Fetch from Twitter Syndication API.
- `enrichTweet(tweet)`, `formatDate`, `getTweetId`, `getMediaUrl`, `formatNumber` - Utilities.

## License

MIT. API logic based on [vercel/react-tweet](https://github.com/vercel/react-tweet) (MIT).
