import React, { useEffect, useRef } from 'react'
import { FlatList, Image, SafeAreaView, ScrollView, SectionList, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home'
import { DSO } from '../helpers/types/DSO'
import { app_colors } from '../helpers/constants'
import { GlobalPlanet } from '../helpers/types/GlobalPlanet'
import SearchResultCard from './cards/SearchResultCard'
import SearchPlanetResultCard from './cards/SearchPlanetResultCard'
import { Star } from '../helpers/types/Star'
import SearchStarResultCard from './cards/SearchStarResultCard'

interface HomeSearchResultsProps {
  results: DSO[]
  planetResults: GlobalPlanet[]
  starsResults: Star[]
  onReset: () => void
  navigation: any
}

export default function HomeSearchResults({ results, planetResults, onReset, navigation, starsResults }: HomeSearchResultsProps) {

  const flatListRef = useRef<FlatList>(null)
  const planetFlatListRef = useRef<FlatList>(null)
  const starFlatListRef = useRef<FlatList>(null)


  useEffect(() => {
    if (results.length > 0) {
      flatListRef.current?.scrollToIndex({ index: 0 })
    }
    if (planetResults.length > 0) {
      planetFlatListRef.current?.scrollToIndex({ index: 0 })
    }
    if (starsResults.length > 0) {
      starFlatListRef.current?.scrollToIndex({ index: 0 })
    }
  }, [results, planetResults, starsResults])

  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={globalStyles.sections.title}>Objets trouvés</Text>
        {
          (results.length > 0 || planetResults.length > 0) &&
          <TouchableOpacity style={{ backgroundColor: app_colors.white_no_opacity, padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 10, display: 'flex', width: 30, height: 30 }} onPress={() => onReset()}>
            <Image source={require('../../assets/icons/FiTrash.png')} style={{ width: 15, height: 15 }} />
          </TouchableOpacity>
        }
      </View>
      <SafeAreaView style={homeStyles.searchResults}>
        <ScrollView horizontal>
          <FlatList
            ref={planetFlatListRef}
            scrollEnabled={results.length > 1}
            horizontal
            data={planetResults}
            ListEmptyComponent={<></>}
            renderItem={({ item }) => <SearchPlanetResultCard planet={item} navigation={navigation} />}
            keyExtractor={item => item.name + item.ra}
          />
          <FlatList
            ref={flatListRef}
            scrollEnabled={results.length > 1}
            horizontal
            data={results}
            ListEmptyComponent={<></>}
            renderItem={({ item }) => <SearchResultCard object={item} navigation={navigation} />}
            keyExtractor={item => item.name + item.ra}
          />
          <FlatList
            ref={starFlatListRef}
            scrollEnabled={results.length > 1}
            horizontal
            data={starsResults}
            ListEmptyComponent={<></>}
            renderItem={({ item }) => <SearchStarResultCard star={item} navigation={navigation} />}
            keyExtractor={item => item.ids + item.ra}
          />
        </ScrollView>

      </SafeAreaView>
    </View>
  )
}
