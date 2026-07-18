import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../components/Landing/Logo';
import GradientText from '../../components/GradientText';
import HomeGradient from '../../components/Landing/HomeGradient';
import GradeButton from '../../components/Landing/GradeButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import FileButton from '../../components/Landing/FileButton';
import { useEffect, useState } from 'react';
import useFileStore from '../../store/landing/fileStore';
import { useSharedValue, withSpring } from 'react-native-reanimated';


export default function LandingScreen() {


  // const [highlight, setHighlight] = useState('Sheet');
  const [acceptableSheet, setAcceptableSheet] = useState(false);
  const [acceptableKey, setAcceptableKey] = useState(false);

  const sheetWidth = useSharedValue('75%');
  const keyWidth = useSharedValue('50%');

  useEffect(() => {
    if (acceptableSheet == false) {
      sheetWidth.value = withSpring('75%');
      keyWidth.value = withSpring('50%');
    } else if (acceptableSheet == true && acceptableKey == false) {
      sheetWidth.value = withSpring('50%');
      keyWidth.value = withSpring('75%');
    } else {
      sheetWidth.value = withSpring('60%');
      keyWidth.value = withSpring('60%');
    }
  }, [acceptableSheet, acceptableKey])


  const setAnswerSheet = useFileStore((state) => state.setAnswerSheet);
  const setAnswerKey = useFileStore((state) => state.setAnswerKey);


  return (
    <HomeGradient>
      <SafeAreaView style={styles.safeAreaView}>
        <Logo />

        <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <FileButton text='Answer Sheet' width={sheetWidth} setFile={setAnswerSheet}
            onAcceptableFile={() => setAcceptableSheet(true)}
            onUnacceptableFile={() => setAcceptableSheet(false)}
          />
          <FileButton text='Answer Key' width={keyWidth} setFile={setAnswerKey}
            onAcceptableFile={() => setAcceptableKey(true)}
            onUnacceptableFile={() => setAcceptableKey(false)}
          />
        </View>


        <GradeButton />
      </SafeAreaView>

    </HomeGradient>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 15,
  },
  answerSheetParent: {
    backgroundColor: '#85603C'
  }
});
