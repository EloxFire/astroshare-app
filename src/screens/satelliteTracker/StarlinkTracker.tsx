import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../../styles/global'
import { i18n } from '../../helpers/scripts/i18n'
import { starlinkTrackerStyles } from '../../styles/screens/satelliteTracker/starlinkTracker'
import { StarlinkSatellite } from '../../helpers/types/StarlinkSatellite'
import PageTitle from '../../components/commons/PageTitle'
import axios from 'axios'

export default function StarlinkTracker({ navigation }: any) {

  const { currentLocale } = useTranslation()

  const [loading, setLoading] = useState<boolean>(true)
  const [constellation, setConstellation] = useState<StarlinkSatellite[]>([])
  const [selectedSatellite, setSelectedSatellite] = useState<StarlinkSatellite | null>(null)
  const [totalSatellites, setTotalSatellites] = useState<number>(0)
  const [totalActive, setTotalActive] = useState<number>(0)
  const [totalInactive, setTotalInactive] = useState<number>(0)

  useEffect(() => {
    getStarlinkConstellation()
  }, [])

  const getStarlinkConstellation = async () => {
    const constellation = await (await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/spacex/starlink`)).data.data
    setConstellation(constellation.satellites)
    setTotalSatellites(constellation.satellites.length + constellation.satcat_missing_tle.length)
    setTotalActive(constellation.satellites.filter((satellite: StarlinkSatellite) => satellite.DECAY === null && satellite.TLE).length)
    setTotalInactive(constellation.satcat_missing_tle.length)
    
    
    
    setLoading(false)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('satelliteTracker.starlinkTracker.title')}
        subtitle={i18n.t('satelliteTracker.starlinkTracker.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <View style={starlinkTrackerStyles.stats}>
        <View style={starlinkTrackerStyles.stats.stat}>
          <Text style={starlinkTrackerStyles.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.total')}</Text>
          <Text style={starlinkTrackerStyles.stats.stat.value}>{totalSatellites}</Text>
        </View>
        <View style={starlinkTrackerStyles.stats.stat}>
          <Text style={starlinkTrackerStyles.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.active')}</Text>
          <Text style={starlinkTrackerStyles.stats.stat.value}>{totalActive}</Text>
        </View>
        <View style={starlinkTrackerStyles.stats.stat}>
          <Text style={starlinkTrackerStyles.stats.stat.title}>{i18n.t('satelliteTracker.starlinkTracker.stats.inactive')}</Text>
          <Text style={starlinkTrackerStyles.stats.stat.value}>{totalInactive}</Text>
        </View>
      </View>
      <ScrollView>
      </ScrollView>
    </View>
  )
}