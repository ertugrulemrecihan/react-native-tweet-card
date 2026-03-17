import { ScrollView, StyleSheet, Text } from 'react-native';
import { Tweet, getTweetId } from 'react-native-tweet-card';

export default function HomeScreen() {
  const id =
    getTweetId('https://x.com/ertugrulchn/status/2033684325422530615') ??
    '2033684325422530615';
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>react-native-tweet-card</Text>
      <Tweet id={id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  content: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});
