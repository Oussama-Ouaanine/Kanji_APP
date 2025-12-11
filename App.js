import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [loaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf8f5' }}>
        <ActivityIndicator size="large" color="#ff6b4a" />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="dark" />
    </>
  );
}
