import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import { tweetTheme } from './tweet-theme';

const {
  containerPaddingVertical,
  containerPaddingHorizontal,
  avatarSize,
  bodyLineHeight,
  borderRadius,
} = tweetTheme;

const SkeletonBar = ({
  style,
  animatedOpacity,
}: {
  style: object;
  animatedOpacity: Animated.Value;
}) => (
  <Animated.View style={[styles.skeletonBar, style, { opacity: animatedOpacity }]} />
);

export function TweetSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonBar
          style={[styles.avatar, styles.avatarRound]}
          animatedOpacity={opacity}
        />
        <View style={styles.headerRight}>
          <SkeletonBar
            style={styles.lineName}
            animatedOpacity={opacity}
          />
          <SkeletonBar
            style={styles.lineMeta}
            animatedOpacity={opacity}
          />
        </View>
      </View>
      <SkeletonBar style={styles.lineBody1} animatedOpacity={opacity} />
      <SkeletonBar style={styles.lineBody2} animatedOpacity={opacity} />
      <SkeletonBar style={styles.lineBodyShort} animatedOpacity={opacity} />
      <View style={styles.actionsRow}>
        <SkeletonBar style={styles.actionBar} animatedOpacity={opacity} />
        <SkeletonBar style={styles.actionBar} animatedOpacity={opacity} />
        <SkeletonBar style={styles.actionBar} animatedOpacity={opacity} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: containerPaddingVertical,
    paddingHorizontal: containerPaddingHorizontal,
    borderWidth: 1,
    borderColor: tweetTheme.borderColor,
    borderRadius,
    backgroundColor: tweetTheme.bgColor,
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
  },
  avatarRound: {
    borderRadius: avatarSize / 2,
  },
  headerRight: {
    marginLeft: 6,
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  skeletonBar: {
    backgroundColor: tweetTheme.borderColor,
    borderRadius: 6,
  },
  lineName: {
    height: bodyLineHeight * 0.65,
    width: '48%',
    marginBottom: 4,
  },
  lineMeta: {
    height: 12,
    width: '32%',
  },
  lineBody1: {
    height: bodyLineHeight,
    width: '100%',
    marginTop: 2,
    marginBottom: 6,
  },
  lineBody2: {
    height: bodyLineHeight,
    width: '88%',
    marginBottom: 6,
  },
  lineBodyShort: {
    height: bodyLineHeight,
    width: '42%',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 14,
  },
  actionBar: {
    width: 52,
    height: 16,
    borderRadius: 4,
  },
});
