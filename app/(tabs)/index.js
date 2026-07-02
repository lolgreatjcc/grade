import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../components/Landing/Logo';
import GradientText from '../../components/GradientText';
import HomeGradient from '../../components/Landing/HomeGradient';


export default function LandingScreen() {
  return (
    <HomeGradient>

      <Logo />

      <View style={styles.answerSheetParent}> 
        <Text>test</Text>
      </View>

    </HomeGradient>
  );
}

const styles = StyleSheet.create({
  answerSheetParent: {
    backgroundColor: '#85603C'
  } 
});
