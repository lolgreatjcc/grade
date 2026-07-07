import { Button, Pressable, StyleSheet, Touchable, TouchableHighlight, TouchableWithoutFeedback, View } from "react-native";
import Text from "../Text";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import * as DocumentPicker from 'expo-document-picker';
import LottieView from "lottie-react-native";

const SuccessIcon = require('../Animated Icons/Success.json')
const ErrorIcon = require('../Animated Icons/Error.json')


export default function FileButton({
  text = "Fill text",
  width = "65%",
  setFile = () => { }
}) {




  const [dynamicIconSize, setDynamicIconSize] = useState(0);
  const [acceptableFile, setAcceptableFile] = useState(null);

  const [imgPreview, setImgPreview] = useState(null);

  const setUploadSize = (event) => {
    setDynamicIconSize(0.7 * event.nativeEvent.layout.width)
  }

  const retrieveFile = async () => {
    const value = await DocumentPicker.getDocumentAsync();
    if (value.canceled) return;



    const selectedFile = value.assets[0];
    if (selectedFile.mimeType === 'application/pdf' && selectedFile.size < 5242880 ) {
      selectedFile.acceptable = true;
      setAcceptableFile(true);
    } else {
      selectedFile.acceptable = false;
      setAcceptableFile(false);
    }

    setFile(selectedFile);

  }


  return (
    <TouchableHighlight style={[{ width: width }, styles.btnParent]} onPress={retrieveFile} underlayColor={'#A6A0A0'} activeOpacity={0.85} onLayout={setUploadSize}>
      <View style={styles.btn}>
        {acceptableFile == null && <MaterialIcons name="upload" color="#888587" size={dynamicIconSize} />}
        {acceptableFile == true && <LottieView source={SuccessIcon} style={{ width: dynamicIconSize, height: dynamicIconSize }} loop={false} autoPlay />}
        {acceptableFile == false && <LottieView source={ErrorIcon} style={{ width: dynamicIconSize + 32, height: dynamicIconSize + 32 }}  autoPlay />}






        <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}


const styles = StyleSheet.create({
  btnParent: {
    aspectRatio: 1,
    backgroundColor: '#c0bcbc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  btn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#8a8585',
    margin: '1%'
  }
})