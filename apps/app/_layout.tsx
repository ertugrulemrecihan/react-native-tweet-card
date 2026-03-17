import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerTitle: 'react-native-tweet-card',
        }}
      />
      <StatusBar style="auto" />
    </>
  );
}
