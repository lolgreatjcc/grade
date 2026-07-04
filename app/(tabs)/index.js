import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../components/Landing/Logo';
import GradientText from '../../components/GradientText';
import HomeGradient from '../../components/Landing/HomeGradient';
import GradeButton from '../../components/Landing/GradeButton';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function LandingScreen() {
  return (
    <HomeGradient>
      <SafeAreaView style={styles.safeAreaView}>

        <Logo />
        <View style={{ flex: 1 }}></View>


        <GradeButton />
      </SafeAreaView>

    </HomeGradient>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: '100%',
  },
  answerSheetParent: {
    backgroundColor: '#85603C'
  }
});
