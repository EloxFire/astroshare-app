import React from 'react'
import { View, TextInput, Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import { inputWithIconStyles } from '../../styles/components/forms/inputWithIcon'
import { app_colors } from '../../helpers/constants'


interface InputWithIconProps {
  placeholder: string
  changeEvent: (searchString: string) => void
  search: () => void
  icon: ImageSourcePropType
  value: string
}

export default function InputWithIcon({ placeholder, changeEvent, icon, search, value }: InputWithIconProps) {
  return (
    <View style={inputWithIconStyles.inputContainer}>
      <TextInput
        style={inputWithIconStyles.inputContainer.input}
        placeholder={placeholder}
        onChangeText={(searchString) => {changeEvent(searchString)}}
        underlineColorAndroid="transparent"
        placeholderTextColor="#FFFFFF25"
        value={value}
      />
      <TouchableOpacity onPress={() => search()}>
        <Image style={[inputWithIconStyles.inputContainer.inputIcon, {tintColor: value !== '' ? app_colors.white : '#FFFFFF25'}]} source={icon} resizeMode='contain' />
      </TouchableOpacity>
    </View>
  )
}
