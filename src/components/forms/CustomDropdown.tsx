import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'
import { inputWithIconStyles } from '../../styles/components/forms/inputWithIcon'
import { app_colors } from '../../helpers/constants'

type DropdownItem = {
  label: string
  value: string
}

interface BaseCustomDropdownProps {
  data: DropdownItem[]
  placeholder?: string
  search?: boolean
  additionalStyles?: any
}

interface SingleSelectProps extends BaseCustomDropdownProps {
  multiselect?: false
  value: string
  onChange: (value: string) => void
}

interface MultiSelectProps extends BaseCustomDropdownProps {
  multiselect: true
  value: string[]
  onChange: (value: string[]) => void
  maxSelect?: number
}

type CustomDropdownProps = SingleSelectProps | MultiSelectProps

export default function CustomDropdown(props: CustomDropdownProps) {
  const { data, placeholder, search = false, additionalStyles } = props

  if (props.multiselect) {
    const selectedValues = props.value.filter((item) => item !== '')
    const selectedItems = data.filter((item) => selectedValues.includes(item.value))

    return (
      <View style={[styles.multiSelectWrapper, additionalStyles]}>
        <View style={[inputWithIconStyles.inputContainer, styles.container]}>
          <MultiSelect
            data={data}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            search={search}
            value={selectedValues}
            maxSelect={props.maxSelect}
            onChange={props.onChange}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            containerStyle={styles.dropdownContainer}
            activeColor={app_colors.white_twenty}
            selectedStyle={styles.selectedItem}
            visibleSelectedItem={false}
            showsVerticalScrollIndicator={false}
            flatListProps={{ keyboardShouldPersistTaps: 'handled' }}
          />
        </View>

        {selectedItems.length > 0 && (
          <View style={styles.selectedItemsContainer}>
            {selectedItems.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.selectedItemBadge}
                onPress={() => props.onChange(selectedValues.filter((value) => value !== item.value))}
              >
                <Text style={styles.selectedItemBadgeText}>{item.label}</Text>
                <Text style={styles.selectedItemBadgeClose}>x</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={[inputWithIconStyles.inputContainer, styles.container, additionalStyles]}>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        search={search}
        value={props.value || null}
        onChange={(item) => props.onChange(item.value)}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={styles.dropdownContainer}
        activeColor={app_colors.white_twenty}
        showsVerticalScrollIndicator={false}
        flatListProps={{ keyboardShouldPersistTaps: 'handled' }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  multiSelectWrapper: {
    width: '100%',
  },
  container: {
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginVertical: 5,
  },
  dropdown: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  placeholderStyle: {
    color: app_colors.white_sixty,
    fontSize: 12,
  },
  selectedTextStyle: {
    color: app_colors.white,
    fontSize: 12,
  },
  itemTextStyle: {
    color: app_colors.white,
    fontSize: 14,
  },
  inputSearchStyle: {
    color: app_colors.white,
    fontSize: 12,
    height: 40,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    backgroundColor: app_colors.black,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 10,
  },
  selectedItem: {
    backgroundColor: app_colors.white_twenty,
    borderRadius: 8,
    borderColor: app_colors.white_twenty,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  selectedItemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: app_colors.white_twenty,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '100%',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemBadgeText: {
    color: app_colors.white,
    fontSize: 12,
    marginRight: 8,
  },
  selectedItemBadgeClose: {
    color: app_colors.white,
    fontSize: 12,
    opacity: 0.8,
  },
})
