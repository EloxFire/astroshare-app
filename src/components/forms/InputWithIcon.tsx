import React from 'react'
import { View, TextInput, Image, ImageSourcePropType, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native'
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
  inputStyle?: any
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  alternateSubmitEvent?: () => void
  loading?: boolean
}

export default function InputWithIcon({ placeholder, changeEvent, icon, search, value, type, additionalStyles, inputStyle, autoCapitalize, keyboardType, alternateSubmitEvent, loading }: InputWithIconProps) {
  return (
    <View style={[inputWithIconStyles.inputContainer, additionalStyles]}>
      <TextInput
        secureTextEntry={type === 'password'}
        style={[inputWithIconStyles.inputContainer.input, inputStyle]}
        placeholder={placeholder}
        onChangeText={(searchString) => {
          const normalizedValue = type === 'number' ? searchString.replace(/,/g, '.') : searchString
          changeEvent(normalizedValue)
        }}
        underlineColorAndroid="transparent"
        placeholderTextColor={app_colors.white_sixty}
        value={value}
        keyboardType={keyboardType || (type === 'number' ? 'decimal-pad' : 'default')}
        autoCapitalize={autoCapitalize}
        onSubmitEditing={() => {
          if (alternateSubmitEvent) {
            alternateSubmitEvent()
          } else if (search) {
            search()
            Keyboard.dismiss()
          }
        }}
      />
      {loading &&
        <ActivityIndicator size='small' color={app_colors.white} style={inputWithIconStyles.inputContainer.inputIcon} />
      }
      {!loading && icon && search &&
        <TouchableOpacity onPress={() => search()}>
            <Image style={[inputWithIconStyles.inputContainer.inputIcon, { tintColor: value !== '' ? app_colors.white : '#FFFFFF25' }]} source={icon} resizeMode='contain' />
        </TouchableOpacity>
      }
    </View>
  )
}
