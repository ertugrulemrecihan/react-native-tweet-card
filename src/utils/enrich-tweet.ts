/**
 * Based on vercel/react-tweet (MIT)
 * https://github.com/vercel/react-tweet
 */

import type {
  HashtagEntity,
  Indices,
  MediaAnimatedGif,
  MediaDetails,
  MediaEntity,
  MediaVideo,
  QuotedTweet,
  SymbolEntity,
  Tweet,
  TweetBase,
  UrlEntity,
  UserMentionEntity,
} from '../api/types/index';

const getTweetUrl = (tweet: TweetBase) =>
  `https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

const getUserUrl = (usernameOrTweet: string | TweetBase) =>
  `https://x.com/${
    typeof usernameOrTweet === 'string'
      ? usernameOrTweet
      : usernameOrTweet.user.screen_name
  }`;

const getLikeUrl = (tweet: TweetBase) =>
  `https://x.com/intent/like?tweet_id=${tweet.id_str}`;

const getReplyUrl = (tweet: TweetBase) =>
  `https://x.com/intent/tweet?in_reply_to=${tweet.id_str}`;

const getFollowUrl = (tweet: TweetBase) =>
  `https://x.com/intent/follow?screen_name=${tweet.user.screen_name}`;

const getHashtagUrl = (hashtag: HashtagEntity) =>
  `https://x.com/hashtag/${hashtag.text}`;

const getSymbolUrl = (symbol: SymbolEntity) =>
  `https://x.com/search?q=%24${symbol.text}`;

const getInReplyToUrl = (tweet: Tweet) =>
  `https://x.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id_str}`;

export const getMediaUrl = (
  media: MediaDetails,
  size: 'small' | 'medium' | 'large',
): string => {
  const url = new URL(media.media_url_https);
  const extension = url.pathname.split('.').pop();
  if (!extension) return media.media_url_https;
  const pathname = url.pathname.replace(`.${extension}`, '');
  url.searchParams.set('format', extension);
  url.searchParams.set('name', size);
  return `${url.origin}${pathname}${url.search}`;
};

export const getMp4Videos = (media: MediaAnimatedGif | MediaVideo) => {
  const { variants } = media.video_info;
  return variants
    .filter((vid) => vid.content_type === 'video/mp4')
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
};

export const getMp4Video = (media: MediaAnimatedGif | MediaVideo) => {
  const mp4Videos = getMp4Videos(media);
  return mp4Videos.length > 1 ? mp4Videos[1] : mp4Videos[0];
};

export const formatNumber = (n: number): string => {
  if (n > 999999) return `${(n / 1000000).toFixed(1)}M`;
  if (n > 999) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

type TextEntity = { indices: Indices; type: 'text' };

type TweetEntity =
  | HashtagEntity
  | UserMentionEntity
  | UrlEntity
  | MediaEntity
  | SymbolEntity;

type EntityWithType =
  | TextEntity
  | (HashtagEntity & { type: 'hashtag' })
  | (UserMentionEntity & { type: 'mention' })
  | (UrlEntity & { type: 'url' })
  | (MediaEntity & { type: 'media' })
  | (SymbolEntity & { type: 'symbol' });

export type Entity = {
  text: string;
} & (
  | TextEntity
  | (HashtagEntity & { type: 'hashtag'; href: string })
  | (UserMentionEntity & { type: 'mention'; href: string })
  | (UrlEntity & { type: 'url'; href: string })
  | (MediaEntity & { type: 'media'; href: string })
  | (SymbolEntity & { type: 'symbol'; href: string })
);

function addEntities(
  result: EntityWithType[],
  type: EntityWithType['type'],
  entities: TweetEntity[],
) {
  for (const entity of entities) {
    for (const [i, item] of result.entries()) {
      if (
        item.indices[0] > entity.indices[0] ||
        item.indices[1] < entity.indices[1]
      ) {
        continue;
      }
      const items = [{ ...entity, type }] as EntityWithType[];
      if (item.indices[0] < entity.indices[0]) {
        items.unshift({
          indices: [item.indices[0], entity.indices[0]],
          type: 'text',
        });
      }
      if (item.indices[1] > entity.indices[1]) {
        items.push({
          indices: [entity.indices[1], item.indices[1]],
          type: 'text',
        });
      }
      result.splice(i, 1, ...items);
      break;
    }
  }
}

function fixRange(tweet: TweetBase, entities: EntityWithType[]) {
  if (
    tweet.entities.media &&
    tweet.entities.media[0].indices[0] < tweet.display_text_range[1]
  ) {
    tweet.display_text_range[1] = tweet.entities.media[0].indices[0];
  }
  const lastEntity = entities[entities.length - 1];
  if (lastEntity && lastEntity.indices[1] > tweet.display_text_range[1]) {
    lastEntity.indices[1] = tweet.display_text_range[1];
  }
}

function getEntities(tweet: TweetBase): Entity[] {
  const textMap = Array.from(tweet.text);
  const result: EntityWithType[] = [
    { indices: tweet.display_text_range, type: 'text' },
  ];
  addEntities(result, 'hashtag', tweet.entities.hashtags);
  addEntities(result, 'mention', tweet.entities.user_mentions);
  addEntities(result, 'url', tweet.entities.urls);
  addEntities(result, 'symbol', tweet.entities.symbols);
  if (tweet.entities.media) {
    addEntities(result, 'media', tweet.entities.media);
  }
  fixRange(tweet, result);

  return result.map((entity) => {
    const text = textMap.slice(entity.indices[0], entity.indices[1]).join('');
    switch (entity.type) {
      case 'hashtag':
        return Object.assign(entity, { href: getHashtagUrl(entity), text });
      case 'mention':
        return Object.assign(entity, {
          href: getUserUrl(entity.screen_name),
          text,
        });
      case 'url':
      case 'media':
        return Object.assign(entity, {
          href: entity.expanded_url,
          text: entity.display_url,
        });
      case 'symbol':
        return Object.assign(entity, { href: getSymbolUrl(entity), text });
      default:
        return Object.assign(entity, { text });
    }
  });
}

export type EnrichedTweet = Omit<Tweet, 'quoted_tweet'> & {
  url: string;
  user: {
    url: string;
    follow_url: string;
  };
  like_url: string;
  reply_url: string;
  in_reply_to_url?: string;
  entities: Entity[];
  quoted_tweet?: EnrichedQuotedTweet;
};

export type EnrichedQuotedTweet = Omit<QuotedTweet, 'entities'> & {
  url: string;
  entities: Entity[];
};

export const enrichTweet = (tweet: Tweet): EnrichedTweet => {
  const { entities: _e, ...tweetRest } = tweet;
  const quoted_tweet: EnrichedQuotedTweet | undefined = tweet.quoted_tweet
    ? (() => {
        const { entities: _eq, ...qRest } = tweet.quoted_tweet!;
        return {
          ...qRest,
          url: getTweetUrl(tweet.quoted_tweet),
          entities: getEntities(tweet.quoted_tweet),
        } as EnrichedQuotedTweet;
      })()
    : undefined;
  return {
    ...tweetRest,
    url: getTweetUrl(tweet),
    user: {
      ...tweet.user,
      url: getUserUrl(tweet),
      follow_url: getFollowUrl(tweet),
    },
    like_url: getLikeUrl(tweet),
    reply_url: getReplyUrl(tweet),
    in_reply_to_url: tweet.in_reply_to_screen_name
      ? getInReplyToUrl(tweet)
      : undefined,
    entities: getEntities(tweet),
    quoted_tweet,
  } as EnrichedTweet;
};
