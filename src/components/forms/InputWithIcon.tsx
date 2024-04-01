import React from 'react'
import { View, TextInput, Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import { inputWithIconStyles } from '../../styles/components/forms/inputWithIcon'
import { app_colors } from '../../helpers/constants'


interface InputWithIconProps {
  placeholder: string
  changeEvent: (searchString: string) => void
  search: () => void
  icon: ImageSourcePropType
}

export default function InputWithIcon({ placeholder, changeEvent, icon, search }: InputWithIconProps) {
  return (
    <View style={inputWithIconStyles.inputContainer}>
      <TextInput
        style={inputWithIconStyles.inputContainer.input}
        placeholder={placeholder}
        onChangeText={(searchString) => {changeEvent(searchString)}}
        underlineColorAndroid="transparent"
        placeholderTextColor={app_colors.white}
      />
      <TouchableOpacity onPress={() => search()}>
        <Image style={inputWithIconStyles.inputContainer.inputIcon} source={icon} resizeMode='contain' />
      </TouchableOpacity>
    </View>
  )
}
