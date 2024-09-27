import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { i18n } from '../../helpers/scripts/i18n';
import { starlinkTrackerStyles } from '../../styles/screens/satelliteTracker/starlinkTracker';
import { StarlinkSatellite } from '../../helpers/types/StarlinkSatellite';
import { mapStyle } from '../../helpers/mapJsonStyle';
import { app_colors } from '../../helpers/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSpacex } from '../../contexts/SpaceXContext';
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE';
import { issTrackerStyles } from '../../styles/screens/satelliteTracker/issTracker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SimpleButton from '../../components/commons/buttons/SimpleButton';
import DSOValues from '../../components/commons/DSOValues';
import PageTitle from '../../components/commons/PageTitle';
import dayjs from 'dayjs';
import { radToDeg } from 'three/src/math/MathUtils';
import { getLaunchStatus } from '../../helpers/scripts/astro/launchApi/getLaunchStatus';

type StarlinkMarker = { latitude: number; longitude: number; title: string };

export default function StarlinkTracker({ navigation }: any) {
  const { constellation, nextStarlinkLaunches } = useSpacex();

  const [activeSatellites, setActiveSatellites] = useState<StarlinkSatellite[]>(constellation.satellites.filter(
    (satellite: StarlinkSatellite) => satellite.DECAY === null && satellite.TLE
  ));
  const [markers, setMarkers] = useState<StarlinkMarker[]>([]);
  const [launchDetails, setLaunchDetails] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleMarkers, setVisibleMarkers] = useState<StarlinkMarker[]>([]);
  const [visibleRegion, setVisibleRegion] = useState<any>(null);

  const mapRef = useRef(null);

  const handleLauncgDetails = (index: number) => {
    if (launchDetails === index) {
      setLaunchDetails(-1);
    } else {
      setLaunchDetails(index);
    }
  };


  useEffect(() => {
    setLoading(true);
    const markers: StarlinkMarker[] = [];
    activeSatellites.forEach(async (satellite: StarlinkSatellite) => {
      const coords = await getSatelliteCoordsFromTLE(satellite.TLE);
      if(!coords) return;
      markers.push({
        latitude: coords.latitude,
        longitude: coords.longitude,
        title: satellite.SATNAME,
      });
    });
    setMarkers(markers);
    setLoading(false);
  }, []);

  useEffect(() => {
    if(!visibleRegion){
      setLoading(true);
      const visibleMarkers = markers.filter((marker: StarlinkMarker) => {
        return (
          radToDeg(marker.latitude) < 0 + visibleRegion.latitudeDelta &&
          radToDeg(marker.latitude) > 0 - visibleRegion.latitudeDelta &&
          radToDeg(marker.longitude) < 0 + visibleRegion.longitudeDelta &&
          radToDeg(marker.longitude) > 0 - visibleRegion.longitudeDelta
        );
      });
      setVisibleMarkers(visibleMarkers);
      setLoading(false);
    }else{
      setLoading(true);
      const visibleMarkers = markers.filter((marker: StarlinkMarker) => {
        return (
          radToDeg(marker.latitude) < visibleRegion.latitude + visibleRegion.latitudeDelta &&
          radToDeg(marker.latitude) > visibleRegion.latitude - visibleRegion.latitudeDelta &&
          radToDeg(marker.longitude) < visibleRegion.longitude + visibleRegion.longitudeDelta &&
          radToDeg(marker.longitude) > visibleRegion.longitude - visibleRegion.longitudeDelta
        );
      });
      setVisibleMarkers(visibleMarkers);
      setLoading(false);
    }
  }, [visibleRegion]);

  return (
    <GestureHandlerRootView>
      <View style={globalStyles.body}>
        <PageTitle
          navigation={navigation}
          title={i18n.t('satelliteTracker.starlinkTracker.title')}
          subtitle={i18n.t('satelliteTracker.starlinkTracker.subtitle')}
        />
        <View style={globalStyles.screens.separator} />
        <ScrollView>
          <View style={starlinkTrackerStyles.content}>
            <View style={starlinkTrackerStyles.content.statsContainer}>
              <Text style={[globalStyles.sections.title, { fontSize: 20, marginBottom: 10 }]}>
                {i18n.t('satelliteTracker.starlinkTracker.stats.title')}
              </Text>
              <DSOValues
                title={i18n.t('satelliteTracker.starlinkTracker.stats.total')}
                value={constellation.satellites.length + constellation.satcat_missing_tle.length}
              />
              <DSOValues
                title={i18n.t('satelliteTracker.starlinkTracker.stats.active')}
                value={constellation.satellites.filter(
                  (satellite: StarlinkSatellite) => satellite.DECAY === null && satellite.TLE
                ).length}
              />
              <DSOValues
                title={i18n.t('satelliteTracker.starlinkTracker.stats.inactive')}
                value={constellation.satcat_missing_tle.length}
              />
            </View>
            <View style={issTrackerStyles.content.mapContainer}>
              <Text style={issTrackerStyles.content.liveStats.title}>
                {i18n.t('satelliteTracker.issTracker.2dMap.title')}
              </Text>
              {loading && (
                <Text>
                  <ActivityIndicator size={'small'} color={app_colors.white} animating /> {i18n.t('common.loadings.simple')}
                </Text>
              )}
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={issTrackerStyles.content.mapContainer.map}
                customMapStyle={mapStyle}
                initialRegion={{
                  latitude: 0,
                  longitude: 0,
                  latitudeDelta: 32,
                  longitudeDelta: 32,
                }}
                onRegionChangeComplete={(region) => setVisibleRegion(region)}
                rotateEnabled={false}
                cameraZoomRange={{ minCenterCoordinateDistance: 1000 }}
              >
                {!loading &&
                  visibleMarkers.length > 0 &&
                  visibleMarkers.map((marker: StarlinkMarker, index: number) => (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude: radToDeg(marker.latitude),
                        longitude: radToDeg(marker.longitude),
                      }}
                      title={marker.title}
                      description={marker.title}
                    >
                      <View style={{ backgroundColor: app_colors.red, width: 2, height: 2 }}>
                        <Text style={{color: 'white', fontSize: 10}}>{marker.title}</Text>
                      </View>
                    </Marker>
                  ))}
              </MapView>
            </View>
            <View style={starlinkTrackerStyles.content.launches}>
                <Text style={globalStyles.sections.title}>{i18n.t('satelliteTracker.starlinkTracker.launches.title')}</Text>
                <View style={starlinkTrackerStyles.content.launches.list}>
                  {
                    nextStarlinkLaunches.length > 0 ?
                    nextStarlinkLaunches.map((launch: any, launch_index: number) => (
                      <View key={launch_index} style={starlinkTrackerStyles.content.launches.list.launch}>
                        <Text style={starlinkTrackerStyles.content.launches.list.launch.title}>{launch.name.split('|')[1].trim()}</Text>
                        <View style={starlinkTrackerStyles.content.launches.list.launch.infos}>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.status')}</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{getLaunchStatus(launch.status.id)}</Text>
                          </View>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.date')}</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{dayjs(launch.net).format('DD/MM/YYYY')}</Text>
                          </View>
                          <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.launcher')}</Text>
                            <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.rocket.configuration.name}</Text>
                          </View>
                        </View>
                        {
                          launchDetails === launch_index &&
                          <View style={starlinkTrackerStyles.content.launches.list.launch.moreInfos}>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.weather')}</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.weather_concerns ? "À surveiller" : "OK"}</Text>
                            </View>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.orbit')}</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.mission.orbit.abbrev}</Text>
                            </View>
                            <View style={starlinkTrackerStyles.content.launches.list.launch.infos.info}>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.label}>{i18n.t('satelliteTracker.starlinkTracker.launches.launch.type')}</Text>
                              <Text style={starlinkTrackerStyles.content.launches.list.launch.infos.info.value}>{launch.launch_service_provider.type}</Text>
                            </View>
                          </View>
                        }
                        <View style={{marginTop: 10}}>
                          <SimpleButton small text={launch_index === launchDetails ? i18n.t('satelliteTracker.starlinkTracker.launches.launch.button.less') : i18n.t('satelliteTracker.starlinkTracker.launches.launch.button.more')} onPress={() => handleLauncgDetails(launch_index)} />
                        </View>
                      </View>
                    ))
                    :
                    <SimpleButton disabled text={i18n.t('satelliteTracker.starlinkTracker.launches.empty')} />
                  }
                </View>
              </View>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
