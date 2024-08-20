import React, { useEffect, useRef } from 'react'
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, SectionList, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home'
import { DSO } from '../helpers/types/DSO'
import { app_colors } from '../helpers/constants'
import { GlobalPlanet } from '../helpers/types/GlobalPlanet'
import SearchResultCard from './cards/SearchResultCard'
import SearchPlanetResultCard from './cards/SearchPlanetResultCard'
import { Star } from '../helpers/types/Star'
import SearchStarResultCard from './cards/SearchStarResultCard'
import { i18n } from '../helpers/scripts/i18n'

interface HomeSearchResultsProps {
  results: DSO[]
  planetResults: GlobalPlanet[]
  starsResults: Star[]
  onReset: () => void
  navigation: any
  loading: boolean
}

export default function HomeSearchResults({ results, planetResults, onReset, navigation, starsResults, loading }: HomeSearchResultsProps) {

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
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={globalStyles.sections.title}>{i18n.t('homeSearchModule.found_objects')}</Text>
          {
            loading && (
              <ActivityIndicator size="small" color={app_colors.white} />
            )
          }
          {
            (results.length > 0 || planetResults.length > 0 || starsResults.length > 0) &&
            <TouchableOpacity style={{ backgroundColor: app_colors.white_no_opacity, padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 10, display: 'flex', width: 30, height: 30 }} onPress={() => onReset()}>
              <Image source={require('../../assets/icons/FiTrash.png')} style={{ width: 15, height: 15 }} />
            </TouchableOpacity>
          }
        </View>
        {
          !loading &&
          <Text style={{ color: app_colors.white, fontSize: 14, marginLeft: 10 }}> {results.length + planetResults.length + starsResults.length} {i18n.t('homeSearchModule.results')}</Text>
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
