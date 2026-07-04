import { StyleSheet, Text, View } from "react-native";
import GradientText from "../GradientText";
import Logo from "./Logo";



export default function GradeButton() {

  return (
    <View style={styles.parentContainer}>
      <View style={styles.buttonContainer}>
        <GradientText text={'grade'} textStyle={styles.textDesign} colors={['#BAA678', '#E7E0DE']} />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  parentContainer: {
    width: '100%',
  },
  buttonContainer: {
    borderRadius: 15,
    backgroundColor: '#2A1F13',
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',

  },
  textDesign: {
    fontSize: 32,
    letterSpacing: -1,
    fontFamily: "Ponomar_400Regular"
  }
})