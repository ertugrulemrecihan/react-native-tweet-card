import { Image } from 'expo-image';
import { openBrowserAsync } from 'expo-web-browser';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Tweet, getTweetId } from 'react-native-tweet';

const AVENY_LOGO =
  'https://framerusercontent.com/images/8YimitmLM1WvPR1VXYzHIhHEF4.png?width=515&height=480';
const AVENY_URL = 'https://aveny.co';

const EXAMPLE_TWEET = 'https://x.com/ertugrulchn/status/2033034029847486493';
const tweetId = getTweetId(EXAMPLE_TWEET) ?? '20';

export default function Screen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => openBrowserAsync(AVENY_URL)}
          style={styles.logoWrap}
          accessibilityLabel="Aveny - Digital Product & Web Solutions Studio"
        >
          <Image
            source={{ uri: AVENY_LOGO }}
            style={styles.logo}
            contentFit="contain"
          />
        </Pressable>
        <ThemedText type="subtitle" style={styles.brandText}>
          by{' '}
          <ThemedText
            type="defaultSemiBold"
            style={styles.link}
            onPress={() => openBrowserAsync(AVENY_URL)}
          >
            Aveny
          </ThemedText>
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          react-native-tweet
        </ThemedText>
        <ThemedText style={styles.sectionDesc}>
          Tweet embed — aynı API (vercel/react-tweet), React Native arayüzü.
        </ThemedText>
      </View>

      <View style={styles.tweetWrap}>
        <Tweet id={tweetId} messages={{ showMore: 'Devamını oku' }} />
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          <ThemedText
            type="defaultSemiBold"
            onPress={() => openBrowserAsync(AVENY_URL)}
            style={styles.footerLink}
          >
            Aveny
          </ThemedText>
          {' — Digital Product & Web Solutions'}
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 24 },
  logoWrap: { marginBottom: 8 },
  logo: { width: 80, height: 80 },
  brandText: { opacity: 0.8 },
  link: { color: '#0a7ea4' },
  section: { marginBottom: 16 },
  sectionTitle: { marginBottom: 4 },
  sectionDesc: { opacity: 0.9 },
  tweetWrap: { marginBottom: 24, alignSelf: 'stretch' },
  footer: { alignItems: 'center', gap: 8 },
  footerText: { fontSize: 13, opacity: 0.8, textAlign: 'center' },
  footerLink: { color: '#0a7ea4' },
});
