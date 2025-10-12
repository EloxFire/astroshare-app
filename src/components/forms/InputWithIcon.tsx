import React from 'react'
import { View, TextInput, Image, ImageSourcePropType, TouchableOpacity, Keyboard } from 'react-native'
import { inputWithIconStyles } from '../../styles/components/forms/inputWithIcon'
import { app_colors } from '../../helpers/constants'


interface InputWithIconProps {
  placeholder: string
  changeEvent: (searchString: string) => void
  search?: () => void
  icon?: ImageSourcePropType
  value: string | undefined
  type: 'text' | 'password' | 'number'
  keyboardType?: 'numeric' | 'default' | 'decimal-pad'
  additionalStyles?: any
  alternateSubmitEvent?: () => void
}

export default function InputWithIcon({ placeholder, changeEvent, icon, search, value, type, additionalStyles, keyboardType, alternateSubmitEvent }: InputWithIconProps) {
  return (
    <View style={[inputWithIconStyles.inputContainer, additionalStyles]}>
      <TextInput
        secureTextEntry={type === 'password'}
        style={inputWithIconStyles.inputContainer.input}
        placeholder={placeholder}
        onChangeText={(searchString) => { changeEvent(searchString) }}
        underlineColorAndroid="transparent"
        placeholderTextColor={app_colors.white_sixty}
        value={value}
        keyboardType={keyboardType || 'default'}
        onSubmitEditing={() => {
          if (alternateSubmitEvent) {
            alternateSubmitEvent()
          } else if (search) {
            search()
            Keyboard.dismiss()
          }
        }}
      />
      {icon && search &&
        <TouchableOpacity onPress={() => search()}>
            <Image style={[inputWithIconStyles.inputContainer.inputIcon, { tintColor: value !== '' ? app_colors.white : '#FFFFFF25' }]} source={icon} resizeMode='contain' />
        </TouchableOpacity>
      }
    </View>
  )
}
