import { Ponomar_400Regular } from '@expo-google-fonts/ponomar/400Regular';
import { Raleway_400Regular } from '@expo-google-fonts/raleway'
import { useFonts } from '@expo-google-fonts/ponomar/useFonts';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  let [fontsLoaded] = useFonts({
    Ponomar_400Regular,
    Raleway_400Regular
  })

  if(!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
    </Stack>
  );
}
