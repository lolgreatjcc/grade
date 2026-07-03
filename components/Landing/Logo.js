import { StyleSheet, Text } from "react-native";

import { useFonts } from '@expo-google-fonts/ponomar/useFonts';
import { Ponomar_400Regular } from '@expo-google-fonts/ponomar/400Regular';
import GradientText from "../GradientText";


export default function Logo() {



  return (
    <GradientText text={'grade'} textStyle={styles.logoDesign} colors={['#BAA678', '#E7E0DE']} />
  )
}

const styles = StyleSheet.create({
  logoDesign: {
    fontSize: 96,
    fontFamily: "Ponomar_400Regular"
  }

})