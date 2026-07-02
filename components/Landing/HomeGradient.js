import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";


export default function HomeGradient(props) {


  return (
    <LinearGradient style={styles.landingContainer} colors={['#85603C', '#2A1F13']}
      start={[0, 0]} end={[1, 1]}
    >
      {props.children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  landingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});