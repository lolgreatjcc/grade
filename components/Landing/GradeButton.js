import { Button, Pressable, StyleSheet, Text, Touchable, TouchableWithoutFeedback, View } from "react-native";
import GradientText from "../GradientText";
import Logo from "./Logo";
import useFileStore from "../../store/landing/fileStore";
import { File, Directory, Paths } from 'expo-file-system';
import axios from "axios";




export default function GradeButton() {

  const answerSheet = useFileStore((state) => state.answerSheet);
  const answerKey = useFileStore((state) => state.answerKey);


  const acceptableFiles = (() => {
    if (answerKey === null || answerSheet === null) return false;
    if (answerKey.acceptable === false || answerSheet.acceptable === false) return false;
    return true
  })();



  async function grade() {
    console.log(acceptableFiles);
    if (!acceptableFiles) return true

    
    const formData = new FormData();

    formData.append('files', {
      uri: answerSheet.uri,
      name: answerSheet.name,
      type: "application/pdf"
    });
    formData.append('files', {
      uri: answerKey.uri,
      name: answerSheet.name,
      type: "application/pdf"
    });


    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/grade`, formData).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <Pressable style={styles.parentContainer} onPress={grade}>
      <View style={styles.buttonContainer}>
        <GradientText text={'grade'} textStyle={styles.textDesign} colors={['#BAA678', '#E7E0DE']} />
      </View>
    </Pressable>
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