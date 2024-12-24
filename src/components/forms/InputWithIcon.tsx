import React from 'react'
import { View, TextInput, Image, ImageSourcePropType, TouchableOpacity, Keyboard } from 'react-native'
import { inputWithIconStyles } from '../../styles/components/forms/inputWithIcon'
import { app_colors } from '../../helpers/constants'


interface InputWithIconProps {
  placeholder: string
  changeEvent: (searchString: string) => void
  search?: () => void
  icon?: ImageSourcePropType
  value: string
  type: 'text' | 'password'
  keyboardType?: 'numeric' | 'default'
  additionalStyles?: any
}

export default function InputWithIcon({ placeholder, changeEvent, icon, search, value, type, additionalStyles, keyboardType }: InputWithIconProps) {
  return (
    <View style={[inputWithIconStyles.inputContainer, additionalStyles]}>
      <TextInput
        secureTextEntry={type === 'password'}
        style={inputWithIconStyles.inputContainer.input}
        placeholder={placeholder}
        onChangeText={(searchString) => { changeEvent(searchString) }}
        underlineColorAndroid="transparent"
        placeholderTextColor="#FFFFFF60"
        value={value}
        keyboardType={keyboardType || 'default'}
      />
      {icon && search &&
        <TouchableOpacity onPress={() => search()}>
            <Image style={[inputWithIconStyles.inputContainer.inputIcon, { tintColor: value !== '' ? app_colors.white : '#FFFFFF25' }]} source={icon} resizeMode='contain' />
        </TouchableOpacity>
      }
    </View>
  )
}
