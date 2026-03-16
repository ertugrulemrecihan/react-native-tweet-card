import {
  ChatCircle,
  CheckCircle,
  Heart,
  Link as LinkIcon,
} from 'phosphor-react-native';
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { MediaDetails } from '../api/types/index';
import { formatDate } from '../utils/date-utils';
import type {
  EnrichedQuotedTweet,
  EnrichedTweet,
  Entity,
} from '../utils/enrich-tweet';
import { formatNumber, getMediaUrl } from '../utils/enrich-tweet';
import { tweetTheme } from './tweet-theme';

const theme = tweetTheme;

const TRUNCATE_LEN = 250;

export interface TweetCardMessages {
  showMore?: string;
}

export interface TweetCardProps {
  tweet: EnrichedTweet;
  onPressLink?: (url: string) => void;
  onCardPress?: (tweet: EnrichedTweet) => void;
  messages?: TweetCardMessages;
}

function truncateEntities(
  entities: Entity[],
  maxLen: number,
): { displayEntities: Entity[]; showMore: boolean } {
  let remaining = maxLen;
  const displayEntities: Entity[] = [];
  for (const e of entities) {
    if (remaining <= 0) break;
    const text = (e as Entity & { text: string }).text ?? '';
    if (text.length <= remaining) {
      displayEntities.push(e);
      remaining -= text.length;
    } else {
      displayEntities.push({
        ...e,
        text: text.slice(0, remaining),
      } as Entity);
      remaining = 0;
      break;
    }
  }
  const totalLen = entities.reduce(
    (s, e) => s + ((e as Entity & { text: string }).text?.length ?? 0),
    0,
  );
  return { displayEntities, showMore: totalLen > maxLen };
}

function openUrl(url: string, onPressLink?: (url: string) => void) {
  if (onPressLink) {
    onPressLink(url);
    return;
  }
  Linking.openURL(url).catch(() => {});
}

function VerifiedBadge({ user }: { user: EnrichedTweet['user'] }) {
  const u = user as unknown as Record<string, unknown>;
  const verified = Boolean(
    user.verified ?? u.verified ?? user.verified_type ?? u.verified_type,
  );
  const isBlue = Boolean(user.is_blue_verified ?? u.isBlueVerified);
  if (!verified && !isBlue) return null;
  return (
    <View style={styles.verifiedIcon}>
      <CheckCircle
        size={14}
        color={isBlue ? theme.verifiedBlue : theme.verifiedOld}
        weight="fill"
      />
    </View>
  );
}

function TweetBody({
  entities,
  onPressLink,
  showMoreLabel,
  onShowMore,
}: {
  entities: Entity[];
  onPressLink?: (url: string) => void;
  showMoreLabel?: string;
  onShowMore?: () => void;
}) {
  return (
    <Text style={styles.body} selectable>
      {entities.map((entity, i) => {
        const key = `${entity.indices[0]}-${i}`;
        if (entity.type === 'text') {
          return (
            <Text key={key}>{(entity as Entity & { text: string }).text}</Text>
          );
        }
        return (
          <Text
            key={key}
            style={styles.link}
            onPress={() =>
              openUrl((entity as Entity & { href: string }).href, onPressLink)
            }
          >
            {(entity as Entity & { text: string }).text}
          </Text>
        );
      })}
      {showMoreLabel != null && onShowMore != null ? (
        <>
          <Text> ... </Text>
          <Text
            style={styles.link}
            onPress={() => {
              onShowMore();
            }}
          >
            {showMoreLabel}
          </Text>
        </>
      ) : null}
    </Text>
  );
}

function TweetMedia({ mediaDetails }: { mediaDetails: MediaDetails[] }) {
  if (!mediaDetails?.length) return null;
  const first = mediaDetails[0];
  const mediaUrl = getMediaUrl(first, 'large');
  const aspectRatio = first.original_info
    ? first.original_info.width / first.original_info.height
    : 16 / 9;
  return (
    <View style={[styles.mediaWrap, { aspectRatio: Math.min(aspectRatio, 2) }]}>
      <Image
        source={{ uri: mediaUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    </View>
  );
}

function QuotedTweetCard({
  quoted,
  onPressLink,
}: {
  quoted: EnrichedQuotedTweet;
  onPressLink?: (url: string) => void;
}) {
  return (
    <Pressable
      style={styles.quoted}
      onPress={() => openUrl(quoted.url, onPressLink)}
      android_ripple={{ color: theme.quotedBgHover }}
    >
      <View style={styles.quotedHeader}>
        <Text style={styles.quotedName} numberOfLines={1}>
          {quoted.user.name}
        </Text>
        <Text style={styles.quotedMeta}>@{quoted.user.screen_name}</Text>
      </View>
      <Text style={styles.quotedBody} numberOfLines={3}>
        {quoted.entities.map((e) => e.text).join('')}
      </Text>
    </Pressable>
  );
}

const defaultMessages: TweetCardMessages = { showMore: 'Show more' };

export function TweetCard({
  tweet,
  onPressLink,
  onCardPress,
  messages = defaultMessages,
}: TweetCardProps) {
  const { displayEntities, showMore } = truncateEntities(
    tweet.entities,
    TRUNCATE_LEN,
  );
  const showMoreLabel = messages.showMore ?? defaultMessages.showMore;

  const content = (
    <>
      <View style={styles.header}>
        <Pressable onPress={() => openUrl(tweet.user.url, onPressLink)}>
          <Image
            source={{ uri: tweet.user.profile_image_url_https }}
            style={styles.avatar}
          />
        </Pressable>
        <View style={styles.author}>
          <View style={styles.authorRow}>
            <Text style={styles.authorName} numberOfLines={1}>
              {tweet.user.name}
            </Text>
            <VerifiedBadge user={tweet.user} />
          </View>
          <View style={styles.authorMeta}>
            <Text style={styles.username} numberOfLines={1}>
              @{tweet.user.screen_name}
            </Text>
            <Text style={styles.sep}> · </Text>
            <Pressable
              onPress={() => openUrl(tweet.user.follow_url, onPressLink)}
            >
              <Text style={styles.follow}>Follow</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {tweet.in_reply_to_screen_name && tweet.in_reply_to_url && (
        <Pressable
          style={styles.inReplyTo}
          onPress={() => openUrl(tweet.in_reply_to_url!, onPressLink)}
        >
          <Text style={styles.inReplyToText}>
            Replying to @{tweet.in_reply_to_screen_name}
          </Text>
        </Pressable>
      )}

      <TweetBody
        entities={displayEntities}
        onPressLink={onPressLink}
        showMoreLabel={showMore ? showMoreLabel : undefined}
        onShowMore={
          showMore ? () => openUrl(tweet.url, onPressLink) : undefined
        }
      />

      {tweet.mediaDetails?.length ? (
        <View style={styles.mediaContainer}>
          <TweetMedia mediaDetails={tweet.mediaDetails} />
        </View>
      ) : null}

      {tweet.quoted_tweet && (
        <QuotedTweetCard
          quoted={tweet.quoted_tweet}
          onPressLink={onPressLink}
        />
      )}

      <View style={styles.info}>
        <Text style={styles.date}>{formatDate(tweet.created_at)}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => openUrl(tweet.reply_url, onPressLink)}
          style={styles.action}
        >
          <ChatCircle
            size={16}
            color={theme.fontColorSecondary}
            weight="regular"
          />
          <Text style={styles.actionText}>Reply</Text>
        </Pressable>
        <Pressable
          onPress={() => openUrl(tweet.like_url, onPressLink)}
          style={styles.action}
        >
          <Heart size={16} color={theme.redPrimary} weight="regular" />
          <Text style={styles.actionText}>
            {tweet.favorite_count > 0
              ? formatNumber(tweet.favorite_count)
              : 'Like'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => openUrl(tweet.url, onPressLink)}
          style={styles.action}
        >
          <LinkIcon
            size={16}
            color={theme.fontColorSecondary}
            weight="regular"
          />
          <Text style={styles.actionText}>View on X</Text>
        </Pressable>
      </View>
    </>
  );

  if (onCardPress != null) {
    return (
      <Pressable
        style={styles.container}
        onPress={() => onCardPress(tweet)}
        android_ripple={{ color: theme.bgColorHover }}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.containerPaddingVertical,
    paddingHorizontal: theme.containerPaddingHorizontal,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.bgColor,
    minWidth: 250,
    maxWidth: 550,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  avatar: {
    width: theme.avatarSize,
    height: theme.avatarSize,
    borderRadius: theme.avatarSize / 2,
  },
  author: {
    marginLeft: 6,
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: theme.headerFontSize,
    fontWeight: '700',
    color: theme.fontColor,
  },
  verifiedIcon: {
    marginLeft: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 14,
    height: 14,
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  username: {
    fontSize: theme.headerFontSize,
    color: theme.fontColorSecondary,
  },
  sep: {
    color: theme.fontColorSecondary,
    fontSize: theme.headerFontSize,
  },
  follow: {
    fontSize: theme.headerFontSize,
    fontWeight: '700',
    color: theme.blueSecondary,
  },
  inReplyTo: {
    marginBottom: 4,
  },
  inReplyToText: {
    fontSize: theme.bodyFontSize,
    color: theme.bluePrimary,
  },
  body: {
    fontSize: theme.bodyFontSize,
    lineHeight: theme.bodyLineHeight,
    color: theme.fontColor,
    marginBottom: 0,
  },
  link: {
    color: theme.bluePrimary,
  },
  mediaContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.bgColorHover,
  },
  mediaWrap: {
    width: '100%',
    maxHeight: 280,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quoted: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.borderColor,
    borderRadius: 12,
    backgroundColor: theme.bgColorHover,
  },
  quotedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quotedName: {
    fontSize: theme.quotedBodyFontSize,
    fontWeight: '700',
    color: theme.fontColor,
    marginRight: 4,
  },
  quotedMeta: {
    fontSize: theme.quotedBodyFontSize,
    color: theme.fontColorSecondary,
  },
  quotedBody: {
    fontSize: theme.quotedBodyFontSize,
    lineHeight: theme.quotedBodyLineHeight,
    color: theme.fontColor,
  },
  info: {
    marginTop: 8,
  },
  date: {
    fontSize: theme.infoFontSize,
    color: theme.fontColorSecondary,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    gap: 4,
  },
  actionText: {
    fontSize: theme.actionsFontSize,
    fontWeight: '600',
    color: theme.fontColorSecondary,
  },
});
