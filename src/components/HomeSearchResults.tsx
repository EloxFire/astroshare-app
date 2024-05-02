import React from 'react'
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home'
import SearchResultCard from './SearchResultCard'
import { DSO } from '../helpers/types/DSO'
import { app_colors } from '../helpers/constants'

interface HomeSearchResultsProps {
  results: DSO[]
  onReset: () => void
  navigation: any
}

export default function HomeSearchResults({ results, onReset, navigation }: HomeSearchResultsProps) {
  return (
    <View>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Text style={globalStyles.sections.title}>Objets trouvés</Text>
        {
          results.length > 0 &&
          <TouchableOpacity style={{backgroundColor: app_colors.white_no_opacity, padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 10, display: 'flex', width: 30, height: 30}} onPress={() => onReset()}>
            <Image source={require('../../assets/icons/FiTrash.png')} style={{ width: 15, height: 15}}/>
          </TouchableOpacity>
        }
      </View>
      <SafeAreaView style={homeStyles.searchResults}>
        <FlatList
          scrollEnabled={results.length > 1}
            horizontal
            data={results}
            renderItem={({ item }) => <SearchResultCard object={item} navigation={navigation} />}
            keyExtractor={item => item.name + item.ra}
          />
        </SafeAreaView>
      </View>
  )
}
