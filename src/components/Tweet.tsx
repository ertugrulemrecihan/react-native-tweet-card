import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTweet } from '../hooks/useTweet';
import type { EnrichedTweet } from '../utils/enrich-tweet';
import { enrichTweet } from '../utils/enrich-tweet';
import { tweetTheme } from './tweet-theme';
import type { TweetCardMessages } from './TweetCard';
import { TweetCard } from './TweetCard';
import { TweetSkeleton } from './TweetSkeleton';

export interface TweetProps {
  id: string;
  onPressLink?: (url: string) => void;
  onCardPress?: (tweet: EnrichedTweet) => void;
  messages?: TweetCardMessages;
}

function TweetNotFound() {
  return (
    <View style={styles.notFound}>
      <Text style={styles.notFoundText}>This tweet is unavailable.</Text>
    </View>
  );
}

export function Tweet({ id, onPressLink, onCardPress, messages }: TweetProps) {
  const { data, error, isLoading } = useTweet(id);
  const enriched = useMemo(() => (data ? enrichTweet(data) : null), [data]);

  if (isLoading) {
    return <TweetSkeleton />;
  }

  if (error || !enriched) {
    return <TweetNotFound />;
  }

  return (
    <TweetCard
      tweet={enriched}
      onPressLink={onPressLink}
      onCardPress={onCardPress}
      messages={messages}
    />
  );
}

const styles = StyleSheet.create({
  notFound: {
    padding: 16,
    borderWidth: 1,
    borderColor: tweetTheme.borderColor,
    borderRadius: tweetTheme.borderRadius,
    backgroundColor: tweetTheme.bgColor,
    minWidth: 250,
    maxWidth: 550,
  },
  notFoundText: {
    fontSize: tweetTheme.bodyFontSize,
    color: tweetTheme.fontColorSecondary,
  },
});
