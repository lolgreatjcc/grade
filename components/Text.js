import { StyleSheet } from "react-native"

import { Text as NativeText } from "react-native"



export default function Text({ style, ...props }) {
  const flattenedStyle = StyleSheet.flatten(style) ?? {};
  const fontWeight = flattenedStyle.fontWeight;

  if (!fontWeight) {
    return <NativeText style={[styles.regularWeight, style]} {...props} />

  }


  if (style.fontWeight == 'medium') {
    return <NativeText style={[styles.mediumWeight, style]} {...props} />
  } else if (style.fontWeight == 'bold') {
    return <NativeText style={[styles.boldWeight, style]} {...props} />
  } else {
    return <NativeText style={[styles.regularWeight, style]} {...props} />
  }
}

const styles = StyleSheet.create({
  regularWeight: {
    fontFamily: "Raleway_400Regular"
  },
  mediumWeight: {
    fontFamily: "Raleway_500Medium"
  },
  boldWeight: {
    fontFamily: "Raleway_700Bold"
  }
})