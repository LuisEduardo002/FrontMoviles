import { Pressable, StyleProp, Text, ViewStyle } from 'react-native'

interface ButtonProps {
  text: string
  variant: any
  onPress: () => void
}

export const Button = ({ text, variant, onPress }: ButtonProps) => {

  return (
    <Pressable onPress={onPress} style={ variant }>
      <Text>{ text }</Text>
    </Pressable>
  )
}

export default Button