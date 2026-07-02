
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

export default function GradientText({
  text,
  parentStyle = {},
  textStyle = {},
  start={ x: 0, y: 0 },
  end={ x: 1, y: 1 },
  colors,
}) {


  return (

    <MaskedView

      maskElement={
        <Text style={[textStyle, { backgroundColor: "transparent" }]}>{text}</Text>
      }
    >
      <LinearGradient colors={colors} start={start} end={end}>
        <Text style={[textStyle, { opacity: 0 } ]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  )

}