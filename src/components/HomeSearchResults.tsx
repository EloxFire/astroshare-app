import React, {ReactNode, useEffect, useRef, useState} from 'react'
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
import {getObjectFamily} from "../helpers/scripts/astro/objects/getObjectFamily";

interface HomeSearchResultsProps {
  results: DSO[]
  planetResults: GlobalPlanet[]
  starsResults: Star[]
  onReset: () => void
  navigation: any
  loading: boolean
}

export default function HomeSearchResults({ results, planetResults, onReset, navigation, starsResults, loading }: HomeSearchResultsProps) {

  const resultsFlatListRef = useRef<FlatList>(null)
  const [data, setData] = useState<(DSO | GlobalPlanet | Star)[]>([])

  useEffect(() => {
    const mergedResults: (DSO | GlobalPlanet | Star)[] = [...planetResults, ...results, ...starsResults]
    setData(mergedResults)
  }, [results, planetResults, starsResults])

  const handleRenderItem = ({item}: {item: DSO | GlobalPlanet | Star}) => {
    const itemFamily = getObjectFamily(item)

    switch (itemFamily) {
      case 'DSO':
        return <SearchResultCard object={item as DSO} navigation={navigation} />
      case 'Planet':
        return <SearchPlanetResultCard planet={item as GlobalPlanet} navigation={navigation} />
      case 'Star':
        return <SearchStarResultCard star={item as Star} navigation={navigation} />
      default:
        return <></>
    }
  }

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
        <FlatList
          ref={resultsFlatListRef}
          scrollEnabled={data.length > 1}
          horizontal
          data={data}
          ListEmptyComponent={<></>}
          renderItem={handleRenderItem}
          keyExtractor={item => `${item.dec}-${item.ra}`}
        />
      </SafeAreaView>
    </View>
  )
}
