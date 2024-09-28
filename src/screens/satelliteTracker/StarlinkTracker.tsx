import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../../styles/global'
import { i18n } from '../../helpers/scripts/i18n'
import { starlinkTrackerStyles } from '../../styles/screens/satelliteTracker/starlinkTracker'
import { StarlinkSatellite } from '../../helpers/types/StarlinkSatellite'
import PageTitle from '../../components/commons/PageTitle'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import * as THREE from 'three'
import * as ExpoTHREE from 'expo-three'
import { app_colors } from '../../helpers/constants'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSpacex } from '../../contexts/SpaceXContext'
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import dayjs from 'dayjs'
import { getLaunchStatus } from '../../helpers/scripts/astro/launchApi/getLaunchStatus'
import { degToRad } from 'three/src/math/MathUtils'
import DSOValues from '../../components/commons/DSOValues'
import { issTrackerStyles } from '../../styles/screens/satelliteTracker/issTracker'
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as FileSystem from 'expo-file-system';

type StarlinkMarker = { latitude: number; longitude: number; title: string };

export default function StarlinkTracker({ navigation }: any) {
  const { constellation, nextStarlinkLaunches } = useSpacex();

  const [markers, setMarkers] = useState<StarlinkMarker[]>([]);
  const [launchDetails, setLaunchDetails] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStallites, setSelectedSatellites] = useState<StarlinkSatellite[]>([]);
  const [data, setData] = useState<any>([]);

  const mapRef = useRef(null);

  // THREE RELATED OBJECTS
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);

  const earthRadius = 6371;  // Earth radius in km


  const earthRef = useRef<THREE.Mesh | null>(null)

  // La fonction pour charger la texture de la Terre
  const loadAndProcessAsset = async () => {
    try {
      // Charger l'asset de la texture
      const asset = Asset.fromModule(require('../../../assets/images/textures/earth_night.jpg'));
      if (!asset.localUri) {
        await asset.downloadAsync();
      }

      const { width, height } = asset;
      const localUri = `${FileSystem.cacheDirectory}copied_texture.png`;
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (!fileInfo.exists) {
        await FileSystem.copyAsync({ from: asset.localUri!, to: localUri });
      }

      const copiedAsset = Asset.fromURI(`${localUri}`);
      copiedAsset.height = height;
      copiedAsset.width = width;
      copiedAsset.localUri = localUri;

      return ExpoTHREE.loadAsync(copiedAsset);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'asset :', error);
    }
  };

  // Modification de la fonction _onContextCreate pour ajouter la Terre avec sa texture
  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;

    // Initialisation de la scène, de la caméra et du renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, drawingBufferWidth / drawingBufferHeight, 0.1, 500000);
    const renderer = new ExpoTHREE.Renderer({ gl });

    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
    camera.position.set(0, 0, 11500);

    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Chargement de la texture de la Terre
    const earthTexture = await loadAndProcessAsset();
    if (earthTexture) {
      const earthGeometry = new THREE.SphereGeometry(earthRadius, 128, 128);
      const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);

      earth.rotation.y = degToRad(-90);
      scene.add(earth);
      earthMeshRef.current = earth;
    }

    // Mise à jour des positions des satellites
    updateSatellitesPosition(constellation.satellites);

    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP();
      }
    };

    animate();
  };

  let oldX = 0.0, oldY = 0.0;
  let polarAngle = Math.PI / 2;  // Angle vertical (hauteur)
  let azimuthalAngle = 0;  // Angle horizontal (autour de l'axe Y)
  const rotationSpeed = 0.005;  
  let distanceFromEarth = 11500;  // Distance fixe de la caméra par rapport à la Terre
  
  // Fonction pour mettre à jour la position de la caméra autour de la Terre
  const updateCameraPosition = (camera: THREE.PerspectiveCamera) => {
    const x = distanceFromEarth * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
    const y = distanceFromEarth * Math.cos(polarAngle);
    const z = distanceFromEarth * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
    
    camera.position.set(x, y, z);
    if(earthMeshRef.current){
      camera.lookAt(earthMeshRef.current.position);  // La caméra regarde toujours la Terre
    }
  }, [constellation]);

  const handleLaunchDetails = (index: number) => {
    if (launchDetails === index) {
      setLaunchDetails(-1);
    } else {
      setLaunchDetails(index);
    }
  };



  const handleSelectSatellite = (event: any) => {
    console.log(event);
    
  }


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
              <MultiSelect
                data={data}
                onChange={(selected) => handleSelectSatellite(selected)}
                labelField={'name'}
                valueField={'id'}
                style={{borderWidth: 1, borderColor: app_colors.white_no_opacity, borderRadius: 5, padding: 5, backgroundColor: app_colors.white_no_opacity}}
              />
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
                  latitude: 45,
                  longitude: 1,
                  latitudeDelta: 25,
                  longitudeDelta: 25,
                }}
                rotateEnabled={false}
                zoomEnabled={false}
              >
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
                          <SimpleButton small text={launch_index === launchDetails ? i18n.t('satelliteTracker.starlinkTracker.launches.launch.button.less') : i18n.t('satelliteTracker.starlinkTracker.launches.launch.button.more')} onPress={() => handleLaunchDetails(launch_index)} />
                        </View>
                      </View>
                    ))
                    :
                    <SimpleButton disabled text={i18n.t('satelliteTracker.starlinkTracker.launches.empty')} />
                  }
                </View>
              </View>
              <Text style={{color: 'white'}}>{JSON.stringify(data)}</Text>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
