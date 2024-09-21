import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { i18n } from '../../helpers/scripts/i18n'
import { useTranslation } from '../../hooks/useTranslation'
import { globalStyles } from '../../styles/global'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { starlinkTrackerStyles } from '../../styles/screens/satelliteTracker/starlinkTracker'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import * as THREE from 'three'
import * as ExpoTHREE from 'expo-three'
import axios from 'axios'
import PageTitle from '../../components/commons/PageTitle'
import { app_colors } from '../../helpers/constants'
import { getSatelliteCoordsFromTLE } from '../../helpers/scripts/astro/coords/getSatelliteCoordsFromTLE'
import { degToRad } from 'three/src/math/MathUtils'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ToggleButton from '../../components/commons/buttons/ToggleButton'

const modelLoader = new GLTFLoader();

export default function IssTracker({ navigation }: any) {


  // THREE RELATED OBJECTS
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const issMeshRef = useRef<THREE.Points | null>(null);
  
  const earthRadius = 6371;  // Earth radius in km
  
  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [issTle, setIssTle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [focusIss, setFocusIss] = useState(true)
  
  const focusIssRef = useRef(focusIss);

  useEffect(() => {
    focusIssRef.current = focusIss;
  }, [focusIss]);

  useEffect(() => {
    getIssData()
    const update = setInterval(() => {
      getIssData()
      updateIssPosition(focusIssRef.current)
    }, 5000)

    return () => clearInterval(update)
  }, [])

  const getIssData = async () => {
    try {
      const position = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss`)
      const trajectoryPoints = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/trajectory`)
      const name = await getLocationName({ lat: position.data.data.latitude, lon: position.data.data.longitude });
      const tle = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)

      const iss = {
        ...position.data.data,
        dsm_lat: convertDDtoDMS(position.data.data.latitude, position.data.data.latitude).dms_lat,
        dsm_lon: convertDDtoDMS(position.data.data.longitude, position.data.data.longitude).dms_lon,
        country: name.country
      }

      setIssPosition(iss)
      setTrajectoryPoints(trajectoryPoints.data.data)
      const fortmatedTle = [tle.data.data.header.trim(), tle.data.data.line1.trim(), tle.data.data.line2.trim()]
      setIssTle(fortmatedTle)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, drawingBufferWidth / drawingBufferHeight, 0.1, 500000); // Grand "far" pour voir les satellites
    const renderer = new ExpoTHREE.Renderer({ gl });

    renderer.setSize(drawingBufferWidth, drawingBufferHeight);

    camera.position.set(0, 0, 11500);

    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    const textureLoader = new ExpoTHREE.TextureLoader();
    const earthTexture = await textureLoader.loadAsync(require('../../../assets/images/textures/earth_night.jpg'));
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 128, 128);  // 128 segments pour une sphère plus lisse
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    earth.rotation.y = degToRad(-90);

    earthMeshRef.current = earth;

    updateIssPosition(focusIss);

    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP();
      }
    };

    animate();
  };

  const updateCameraToFollowIss = (issLat: number, issLon: number) => {
    if (cameraRef.current) {
      console.log("ISS focus is enabled, updating camera");

      const cameraOrbitDistance = 11500;  // Adjust the distance from the Earth's center for the camera's orbit
      const cameraX = cameraOrbitDistance * Math.cos(issLat) * Math.sin(issLon);
      const cameraZ = cameraOrbitDistance * Math.cos(issLat) * Math.cos(issLon);
      const cameraY = cameraOrbitDistance * Math.sin(issLat);  // Adjust the camera height according to the latitude

      // Set the camera's position to orbit above the ISS
      cameraRef.current.position.set(cameraX, cameraY, cameraZ);

      // Ensure the camera still looks at the center of the Earth
      cameraRef.current.lookAt(0, 0, 0);
    }
  }

  const updateIssPosition = async (doesIssNeedFocus: boolean) => {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)
    const tle = [response.data.data.header.trim(), response.data.data.line1.trim(), response.data.data.line2.trim()]
  
    const issGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(3);
  
    // Récupérer les coordonnées du satellite
    if(tle){
      const position = await getSatelliteCoordsFromTLE(tle);
      if (position) {
        const radius = earthRadius + position.altitude;
    
        // Convertir les angles de latitude et longitude de degrés en radians
        const latRad = position.latitude;
        const lonRad = position.longitude;

        // Calcul des coordonnées cartésiennes en utilisant les angles en radians
        const x = radius * Math.cos(latRad) * Math.sin(lonRad);
        const z = radius * Math.cos(latRad) * Math.cos(lonRad);
        const y = radius * Math.sin(latRad);
    
        positions[0] = x;
        positions[1] = y;
        positions[2] = z;

        // Move the camera to orbit above the ISS, keeping its focus on the Earth's center
        console.log('focusIss', focusIss);
        if(doesIssNeedFocus === true){
          updateCameraToFollowIss(latRad, lonRad);
        }
      }
    }
  
    // Mettre à jour les attributs de la géométrie
    issGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    issGeometry.computeBoundingSphere(); // Optionnel pour améliorer les performances de rendu
  
    const satelliteMaterial = new THREE.PointsMaterial({ color: app_colors.red, size: 100 });
    const satelliteMesh = new THREE.Points(issGeometry, satelliteMaterial);
  
    // Si un ancien mesh de satellites existe, le retirer avant d'ajouter le nouveau
    const existingMesh = sceneRef.current?.children.find(child => child instanceof THREE.Points);
    if (existingMesh) {
      sceneRef.current?.remove(existingMesh);
    }
  
    if (sceneRef.current) { 
      sceneRef.current.add(satelliteMesh);
    }
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
  };

  const pan = Gesture.Pan()
  .onStart(() => {
    // Initialize old coordinates for delta calculations
    oldX = 0;
    oldY = 0;
  })
  .onChange((e) => {
  const camera = cameraRef.current;

  if (camera) {
    // Calculate the delta movement from the previous touch point
    const deltaX = e.translationX - oldX;
    const deltaY = e.translationY - oldY;

    // Adjust the rotation speed based on the zoom level
    // Add a minimum threshold to avoid excessive sensitivity
    const adjustedRotationSpeed = Math.max(rotationSpeed * (11500 / distanceFromEarth), 0.00001);

    // Update angles based on the delta movement and adjusted rotation speed
    azimuthalAngle += deltaX * adjustedRotationSpeed;  // Horizontal rotation
    polarAngle -= deltaY * adjustedRotationSpeed;  // Vertical rotation

    // Constrain polarAngle to prevent the camera from going under or over the Earth
    polarAngle = Math.max(0.1, Math.min(Math.PI - 0.1, polarAngle));

    // Update the camera's position
    updateCameraPosition(camera);

    // Update old coordinates for the next gesture change event
    oldX = e.translationX;
    oldY = e.translationY;
  }
});

  return (
    <GestureHandlerRootView>
      <View style={globalStyles.body}>
        <PageTitle
          navigation={navigation}
          title={i18n.t('satelliteTracker.home.buttons.issTracker.title')}
          subtitle={i18n.t('satelliteTracker.home.buttons.issTracker.subtitle')}
        />
          <View style={globalStyles.screens.separator} />
          <ScrollView>
            <View style={starlinkTrackerStyles.content}>
              <View style={starlinkTrackerStyles.content.statsContainer}>
                <Text style={globalStyles.sections.title}>ISS</Text>
                <View style={starlinkTrackerStyles.content.statsContainer.stats}>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>Altitude (Km)</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{issPosition?.altitude.toFixed(2)}</Text>
                  </View>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>Vitesse (Km/h)</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{issPosition?.velocity.toFixed(2)}</Text>
                  </View>
                  <View style={starlinkTrackerStyles.content.statsContainer.stats.stat}>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.title}>Pays</Text>
                    <Text style={starlinkTrackerStyles.content.statsContainer.stats.stat.value}>{getCountryByCode(issPosition?.country)}</Text>
                  </View>
                </View>
              </View>
              <View style={starlinkTrackerStyles.content.glviewContainer}>
                <GestureDetector gesture={pan}>
                  <GLView style={starlinkTrackerStyles.content.glviewContainer.glview} onContextCreate={_onContextCreate} />
                </GestureDetector>
              </View>
              <ToggleButton title='Focus ISS' toggled={focusIss} onToggle={() => setFocusIss(!focusIss)} />
            </View>
          </ScrollView>
        </View>
    </GestureHandlerRootView>
  )
}