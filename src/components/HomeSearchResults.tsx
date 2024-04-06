import React from 'react'
import { FlatList, SafeAreaView, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home'
import SearchResultCard from './SearchResultCard'
import { DSO } from '../helpers/types/DSO'

interface HomeSearchResultsProps {
  results: DSO[]
}

export default function HomeSearchResults({ results }: HomeSearchResultsProps) {
  return (
    <View>
      <Text style={globalStyles.sections.title}>Objets trouvés</Text>
      <SafeAreaView style={homeStyles.searchResults}>
          <FlatList
            horizontal
            data={results}
            renderItem={({ item }) => <SearchResultCard title={item.name} />}
            keyExtractor={item => item.name + item.ra}
          />
        </SafeAreaView>
      </View>
  )
}
