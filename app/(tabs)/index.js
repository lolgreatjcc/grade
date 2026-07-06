import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../components/Landing/Logo';
import GradientText from '../../components/GradientText';
import HomeGradient from '../../components/Landing/HomeGradient';
import GradeButton from '../../components/Landing/GradeButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import FileButton from '../../components/Landing/FileButton';
import { useEffect, useState } from 'react';
import useFileStore from '../../store/landing/fileStore';


export default function LandingScreen() {


  const [highlight, setHighlight] = useState('Sheet');

  const sheetWidth = highlight == 'Sheet' ? '75%' : '40%'
  const keyWidth = highlight == 'Key' ? '65%' : '40%'

  const setAnswerSheet = useFileStore((state) => state.setAnswerSheet);
  const setAnswerKey = useFileStore((state) => state.setAnswerKey);


  


  return (
    <HomeGradient>
      <SafeAreaView style={styles.safeAreaView}>

        <Logo />




        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
          <View style={{ flexGrow: 3, justifyContent: 'center', alignItems: 'center' }}>
            <FileButton text='Answer Sheet' width={sheetWidth} setFile={setAnswerSheet}/>
          </View>
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FileButton text='Answer Key' width={keyWidth} setFile={setAnswerKey}/>
          </View>
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
