import { StyleSheet } from "react-native"

import { Text as NativeText } from "react-native"



export default function Text({ style, ...props}) {
  return <NativeText style={[styles.globalFont, style]} {...props} /> 
}

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Raleway_400Regular"

  }
})