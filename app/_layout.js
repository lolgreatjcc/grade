import { Ponomar_400Regular } from '@expo-google-fonts/ponomar/400Regular';
import { Raleway_400Regular, Raleway_500Medium, Raleway_700Bold } from '@expo-google-fonts/raleway'
import { useFonts } from '@expo-google-fonts/ponomar/useFonts';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  let [fontsLoaded] = useFonts({
    Ponomar_400Regular,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_700Bold,
  })

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <GestureHandlerRootView>

        <StatusBar style="light" />

        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

      </GestureHandlerRootView >
    </ActionSheetProvider>
  );
}
