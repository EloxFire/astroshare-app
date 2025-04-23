import React, { useState, useRef, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { planetariumStyles } from '../../styles/screens/skymap/planetarium';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { useSettings } from '../../contexts/AppSettingsContext';
import * as THREE from "three";
import * as ExpoTHREE from "expo-three";
import { Star } from '../../helpers/types/Star';
import { getStarColor, getStarMaterial } from '../../helpers/scripts/astro/skymap/createStarMaterial';
import { useStarCatalog } from '../../contexts/StarsContext';
import { getEffectiveAngularResolution } from '../../helpers/scripts/astro/skymap/getEffectiveAngularResolution';
import { getEuclideanDistance } from '../../helpers/scripts/astro/skymap/getEuclideanDistance';
import { getFovFromAngularResolution } from '../../helpers/scripts/astro/skymap/getFovFromAngularResolution';
import { createEquatorialGrid } from '../../helpers/scripts/astro/skymap/createEquatorialGrid';
import { drawConstellations } from '../../helpers/scripts/astro/skymap/drawConstellations';
import { createGround } from '../../helpers/scripts/astro/skymap/createGround';
import { convertSphericalToCartesian } from '../../helpers/scripts/astro/skymap/convertSphericalToCartesian';
import { getGlobePosition } from '../../helpers/scripts/astro/skymap/getGlobePosition';
import PlanetariumUI from "../../components/skymap/PlanetariumUI";
import { createAzimuthalGrid } from '../../helpers/scripts/astro/skymap/createAzimuthalGrid';
import { createPointerMaterial } from '../../helpers/scripts/astro/skymap/createPointerMaterial';
import { createPointerTextures } from '../../helpers/scripts/astro/skymap/createPointerTextures';
import {app_colors, planetTextures} from "../../helpers/constants";
import { convertHMSToDegreeFromString } from "../../helpers/scripts/astro/HmsToDegree";
import { convertDMSToDegreeFromString } from "../../helpers/scripts/astro/DmsToDegree";
import planetariumImages from "../../helpers/planetarium_images.json"
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";


let IsInertia = false;
let oldX = 0.0, oldY = 0.0;
let Vx = 0.0, Vy = 0.0;
let camWdth = 0;
let EquatorialGrid: any;
let AzimuthalGrid: any;
let Constellations: any;
let ground: any;
const pointerUICoos = [];
pointerUICoos.push(0, 1, 0);
const pointergeometry = new THREE.BufferGeometry();
pointergeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointerUICoos, 3));
const pointermaterial = createPointerMaterial();
const pointerUI = new THREE.Points(pointergeometry, pointermaterial);
pointerUI.visible = false;
let azAngle = 0;
let altAngle = Math.PI / 2;


export default function Planetarium({ route, navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { starsCatalog } = useStarCatalog();
  const {planets, moonCoords} = useSolarSystem()

  const [cameraWidth, setCameraWidth] = useState<number>(0);
  const [cameraHeight, setCameraHeight] = useState<number>(0);

  const [planetariumLoading, setPlanetariumLoading] = useState<boolean>(true);

  // Use refs for THREE-related objects to keep their state across renders
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<ExpoTHREE.Renderer | null>(null);

  const [currentTapInfos, setCurrentTapInfos] = useState<any>(null);

  const [showEqGrid, setShowEqGrid] = useState<boolean>(false);
  const [showAzGrid, setShowAzGrid] = useState<boolean>(false);
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [showGround, setShowGround] = useState<boolean>(true);

  useEffect(() => {
    const defaultObject = route.params?.defaultObject;
    if (defaultObject) {
      const { ra, dec } = defaultObject;

      let formatedRa = typeof ra === 'string' ? convertHMSToDegreeFromString(ra) : ra;
      let formatedDec = typeof dec === 'string' ? convertDMSToDegreeFromString(dec) : dec;

      let pointerCoos = convertSphericalToCartesian(0.5, parseFloat(formatedRa), parseFloat(formatedDec));
      let g = pointerUI.geometry;
      let p = g.getAttribute('position');
      p.setXYZ(0, pointerCoos.x, pointerCoos.y, pointerCoos.z);
      p.needsUpdate = true;
      pointerUI.visible = true;
      setCurrentTapInfos(defaultObject);
      cameraRef.current?.lookAt(new THREE.Vector3(
        ...Object.values(convertSphericalToCartesian(10, formatedRa, formatedDec))
      ));
    }
  }, [planetariumLoading]);

  useEffect(() => {

    console.log('Planetarium mounted!');
    // Cleanup all ThreeJS related objects when unmounting
    return () => {
      console.log('Cleaning up Planetarium...');
      if (sceneRef.current) {
        sceneRef.current.traverse((object: any) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            object.material.dispose();
          }
          if (object.texture) {
            object.texture.dispose();
          }
        })
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    }
  }, []);


  const _onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;
    setCameraWidth(drawingBufferWidth);
    setCameraHeight(drawingBufferHeight);
    camWdth = drawingBufferWidth;

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, drawingBufferWidth / drawingBufferHeight, 0.1, 10000);
    const renderer = new ExpoTHREE.Renderer({ gl });

    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
    renderer.setClearColor(0x080808); // Background color

    camera.position.set(0, 0, 0); // Camera positioned at the origin

    // Store them in refs
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create stars
    const stars: number[] = [];
    const starSize: number[] = [];
    const starColor: number[] = [];
    const geometry = new THREE.BufferGeometry();
    const material = getStarMaterial();
    starsCatalog.forEach((star: Star) => {
      const { x, y, z } = convertSphericalToCartesian(10, star.ra, star.dec);
      stars.push(x, y, z);
      starSize.push(50 * (Math.max(0.5, 6 - star.V)));
      const indice = getStarColor(star.sp_type);
      starColor.push(2 * indice ** 2, 0.5 / (100 * (indice - 0.5) ** 2 + 1), 2 * (indice - 1) ** 2, 1.0);
    });
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(starSize, 1));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(starColor, 4));
    const starsCloud = new THREE.Points(geometry, material);
    starsCloud.frustumCulled = false;
    starsCloud.renderOrder = 0;
    scene.add(starsCloud);

    // Texture de la voie lactée
    const milkywayGeometry = new THREE.SphereGeometry(100, 64, 64);
    const milkywayMaterial = new THREE.MeshBasicMaterial({ map: new ExpoTHREE.TextureLoader().load(require('../../../assets/images/textures/milkyway.png')), side: THREE.BackSide });
    const milkyway = new THREE.Mesh(milkywayGeometry, milkywayMaterial);

    milkyway.position.set(0, 0, 0);
    if (milkywayMaterial.map) {
      milkywayMaterial.map.flipY = false;
    }
    milkyway.setRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2));
    milkyway.renderOrder = -1;
    scene.add(milkyway);


    // DSO IMAGES
    planetariumImages.images.forEach((image) => {
      const verticesBuffer: number[] = [];
      const uvBuffer: number[] = [];
      const geometry = new THREE.BufferGeometry();

      const indices = [
        0, 1, 2, // first triangle
        2, 3, 0  // second triangle
      ];

      image.worldCoords[0].forEach((imageVertex, index) => {
        const { x, y, z } = convertSphericalToCartesian(11, imageVertex[0], imageVertex[1]);
        verticesBuffer.push(x, y, z);

        // Ajoutez les coordonnées UV correspondantes
        const u = image.textureCoords[0][index][0];
        const v = image.textureCoords[0][index][1];
        uvBuffer.push(u, v);
      });

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(verticesBuffer, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvBuffer, 2));
      geometry.setIndex(indices);

      const textureLoader = new ExpoTHREE.TextureLoader();
      const texture = textureLoader.load(image.imageUrl);

      // Définir le vertex shader
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

          // Définir le fragment shader avec effet de fondu rectangulaire
          const fragmentShader = `
        uniform sampler2D map;
        varying vec2 vUv;
    
        void main() {
          vec4 color = texture2D(map, vUv);
    
          // Calculer la distance par rapport aux bords
          float alpha = 1.0;
          float border = 0.1; // Largeur de la bordure de fondu
    
          if (vUv.x < border || vUv.x > (1.0 - border) || vUv.y < border || vUv.y > (1.0 - border)) {
            // Appliquer un effet de fondu basé sur la distance par rapport aux bords
            float dist = min(vUv.x, 1.0 - vUv.x);
            dist = min(dist, min(vUv.y, 1.0 - vUv.y));
            alpha = smoothstep(0.0, border, dist);
          }
    
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `;

      const nebulaeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending, // Utiliser un mode de fusion normal pour un effet naturel
      });

      const nebulae = new THREE.Mesh(geometry, nebulaeMaterial);
      scene.add(nebulae);
    });

    // PLANETS TEXTURES
    planets.forEach((planet: GlobalPlanet) => {
      const { x, y, z } = convertSphericalToCartesian(10, planet.ra, planet.dec);
      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const texture = new ExpoTHREE.TextureLoader().load(planetTextures[planet.name.toUpperCase()]);
      const material = new THREE.MeshBasicMaterial({ map: texture});
      const planetMesh = new THREE.Mesh(geometry, material);
      planetMesh.position.set(x, y, z);
      scene.add(planetMesh);
    })

    // MOON TEXTURE
    const { x, y, z } = convertSphericalToCartesian(10, moonCoords.ra, moonCoords.dec);
    const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const moonTexture = new ExpoTHREE.TextureLoader().load(planetTextures.MOON);
    const moonNormalMap = new ExpoTHREE.TextureLoader().load(planetTextures.MOON_NORMAL);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormalMap });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(x, y, z);
    scene.add(moonMesh);



    const light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);


    pointerUI.frustumCulled = false;
    const pointerTextures = createPointerTextures();
    pointerUI.material.map = pointerTextures[0];
    pointerUI.renderOrder = 1;
    scene.add(pointerUI);
    let i = 1;

    ///// Grids and Constellations
    EquatorialGrid = createEquatorialGrid(0x337eff);
    EquatorialGrid.grid2.visible = false;
    EquatorialGrid.grid3.visible = false;

    AzimuthalGrid = createAzimuthalGrid(0x4b33ff);
    AzimuthalGrid.grid2.visible = false;
    AzimuthalGrid.grid3.visible = false;

    Object.keys(AzimuthalGrid).forEach((key) => {
      AzimuthalGrid[key].lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
    });

    Constellations = drawConstellations();
    Constellations.renderOrder = 2;
    scene.add(Constellations);

    ground = createGround();
    ground.lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
    ground.renderOrder = 100;
    scene.add(ground);

    let q11 = new THREE.Quaternion;
    let q12 = new THREE.Quaternion;
    let q13 = new THREE.Quaternion;
    let Y1 = new THREE.Vector3(0, 0, 1);
    let X1 = new THREE.Vector3(1, 0, 0);
    q11.setFromAxisAngle(Y1, 0);
    q12.setFromAxisAngle(X1, Math.PI / 2);
    ground.getWorldQuaternion(q13);
    let qtot1 = q13.multiply(q11).multiply(q12);
    camera.setRotationFromQuaternion(qtot1.normalize());
    //camera.lookAt(convertSphericalToCartesian(10, 90, 90));

    setPlanetariumLoading(false);
    console.log('Planetarium loaded!');

    // Animation loop to render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      if (IsInertia) {
        Inertia();
      }

      if (i == 45) {
        pointerUI.material.map = pointerTextures[i];
        i = 0;
      } else {
        pointerUI.material.map = pointerTextures[i];
        i = i + 1;
      }

      ground.lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
      Object.keys(AzimuthalGrid).forEach((key) => {
        AzimuthalGrid[key].lookAt(getGlobePosition(currentUserLocation.lat, currentUserLocation.lon));
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP(); // Required for Expo's GL context
      }
    };

    // Start the animation
    animate();
  };



  const onShowEqGrid = () => {
    if (showEqGrid) {
      sceneRef.current?.remove(EquatorialGrid.grid1);
      sceneRef.current?.remove(EquatorialGrid.grid2);
      sceneRef.current?.remove(EquatorialGrid.grid3);
      setShowEqGrid(false);
    } else {
      sceneRef.current?.add(EquatorialGrid.grid1);
      sceneRef.current?.add(EquatorialGrid.grid2);
      sceneRef.current?.add(EquatorialGrid.grid3);
      setShowEqGrid(true);
    }
  }

  const onShowAzGrid = () => {
    if (showAzGrid) {
      sceneRef.current?.remove(AzimuthalGrid.grid1);
      sceneRef.current?.remove(AzimuthalGrid.grid2);
      sceneRef.current?.remove(AzimuthalGrid.grid3);
      setShowAzGrid(false);
    } else {
      sceneRef.current?.add(AzimuthalGrid.grid1);
      sceneRef.current?.add(AzimuthalGrid.grid2);
      sceneRef.current?.add(AzimuthalGrid.grid3);
      setShowAzGrid(true);
    }
  }
  const onShowConstellations = () => {
    if (showConstellations) {
      sceneRef.current?.remove(Constellations);
      setShowConstellations(false);
    } else {
      sceneRef.current?.add(Constellations);
      setShowConstellations(true);
    }
  }

  const onShowGround = () => {
    if (showGround) {
      sceneRef.current?.remove(ground);
      setShowGround(false);
    } else {
      sceneRef.current?.add(ground);
      setShowGround(true);
    }
  }



  const pan = Gesture.Pan()
    .onBegin(() => {
      IsInertia = false;
    })
    .onStart(() => {
      // console.log('onStart');
      oldX = 0;
      oldY = 0;
      Vx = 0;
      Vy = 0;
    })
    .onChange((e) => {
      const camera = cameraRef.current; // Access camera from ref
      if (camera) {
        let q1 = new THREE.Quaternion;
        let q2 = new THREE.Quaternion;
        let q3 = new THREE.Quaternion;
        let newAzAngle = azAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (e.translationX - oldX);
        let Y = new THREE.Vector3(0, 0, 1);
        q1.setFromAxisAngle(Y, newAzAngle);
        let X = new THREE.Vector3(1, 0, 0);
        let newAltAngle = altAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth) * (e.translationY - oldY);
        if (newAltAngle > Math.PI) {
          newAltAngle = Math.PI;
        } else if (newAltAngle < 0) {
          newAltAngle = 0;
        }
        q2.setFromAxisAngle(X, newAltAngle);
        ground.getWorldQuaternion(q3);
        let qtot = q3.multiply(q1).multiply(q2);
        camera.setRotationFromQuaternion(qtot.normalize());
        azAngle = newAzAngle;
        altAngle = newAltAngle;
        oldX = e.translationX;
        oldY = e.translationY;
        Vx = e.velocityX;
        Vy = e.velocityY;
        camera.updateProjectionMatrix();
      } else {
        console.log("camera is undefined");
      }
    })
    .onEnd(() => {
      IsInertia = true;
    });

  const Inertia = () => {
    const camera = cameraRef.current;
    if (camera) {
      let q1 = new THREE.Quaternion;
      let q2 = new THREE.Quaternion;
      let q3 = new THREE.Quaternion;
      let newAzAngle = azAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), camWdth) * Vx * 0.01;
      let Y = new THREE.Vector3(0, 0, 1);
      q1.setFromAxisAngle(Y, newAzAngle);
      let X = new THREE.Vector3(1, 0, 0);
      let newAltAngle = altAngle + getEffectiveAngularResolution(camera.getEffectiveFOV(), camWdth) * Vy * 0.01;
      if (newAltAngle > Math.PI) {
        newAltAngle = Math.PI;
      } else if (newAltAngle < 0) {
        newAltAngle = 0;
      }
      q2.setFromAxisAngle(X, newAltAngle);
      ground.getWorldQuaternion(q3);
      let qtot = q3.multiply(q1).multiply(q2);
      camera.setRotationFromQuaternion(qtot.normalize());
      azAngle = newAzAngle;
      altAngle = newAltAngle;
      Vx = Vx * 0.98;
      Vy = Vy * 0.98;
      if (Math.abs(Vx) < 0.1) {
        Vx = 0;
      }
      if (Math.abs(Vy) < 0.1) {
        Vy = 0;
      }
      if (Vy == 0 && Vx == 0) {
        IsInertia = false;
      }
      return camera.updateProjectionMatrix();
    }
  }

  let startAngle: number;
  const pinch = Gesture.Pinch()
    .onTouchesDown((e) => {
      const camera = cameraRef.current; // Access camera from ref
      if (!camera) return;
      if (e.numberOfTouches == 2) {
        let startDistance = getEuclideanDistance(e.allTouches[0].x, e.allTouches[0].y, e.allTouches[1].x, e.allTouches[1].y); //distance initiale en pixel entre les deux doigts
        startAngle = startDistance * getEffectiveAngularResolution(camera.getEffectiveFOV(), cameraWidth); //angle entre les deux point celeste pointé par les doigts
      }
    })
    .onTouchesMove((e) => {
      const camera = cameraRef.current; // Access camera from ref
      if (!camera) return;
      if (e.numberOfTouches == 2) {
        let currentDistance = getEuclideanDistance(e.allTouches[0].x, e.allTouches[0].y, e.allTouches[1].x, e.allTouches[1].y);
        let newAngularResolution = startAngle / currentDistance;
        let newFOV = getFovFromAngularResolution(newAngularResolution, cameraWidth);
        if (newFOV < 0.01) {
          newFOV = 0.01;
        } else if (newFOV > 120) {
          newFOV = 120;
        }
        if (newFOV > 50) {
          EquatorialGrid.grid1.visible = true;
          EquatorialGrid.grid2.visible = false;
          EquatorialGrid.grid3.visible = false;

          AzimuthalGrid.grid1.visible = true;
          AzimuthalGrid.grid2.visible = false;
          AzimuthalGrid.grid3.visible = false;
        }
        if (newFOV <= 50 && newFOV > 10) {
          EquatorialGrid.grid1.visible = false;
          EquatorialGrid.grid2.visible = true;
          EquatorialGrid.grid3.visible = false;

          AzimuthalGrid.grid1.visible = false;
          AzimuthalGrid.grid2.visible = true;
          AzimuthalGrid.grid3.visible = false;
        }
        if (newFOV <= 10) {
          EquatorialGrid.grid1.visible = false;
          EquatorialGrid.grid2.visible = false;
          EquatorialGrid.grid3.visible = true;

          AzimuthalGrid.grid1.visible = false;
          AzimuthalGrid.grid2.visible = false;
          AzimuthalGrid.grid3.visible = true;
        }
        camera.fov = newFOV;
        camera.updateProjectionMatrix();
      }
    });

  let actualRotation: number;
  const rotation = Gesture.Rotation()
    .onStart((e) => {
      actualRotation = 0;
    })
    .onChange((e) => {
      const camera = cameraRef.current;
      if (!camera) return;
      camera.rotateZ(e.rotation - (actualRotation || 0));
      actualRotation = e.rotation;
      camera.updateProjectionMatrix();
    })
    .simultaneousWithExternalGesture(pinch);

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart((e) => {
      const camera = cameraRef.current;
      const scene = sceneRef.current;
      if (camera && scene) {
        const raycaster = new THREE.Raycaster();
        raycaster.near = 9;
        raycaster.params.Points.threshold = 0.0015 * camera.getEffectiveFOV();
        raycaster.far = 11;
        const pointer = new THREE.Vector2();
        // console.log('Single tap!');
        pointer.x = (e.x / window.innerWidth) * 2 - 1;
        pointer.y = - (e.y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        let Vmin = 30.0;
        let index = '0';
        if (typeof intersects[0] !== 'undefined') {
          intersects.forEach((value, i) => {
            if (Vmin > parseFloat(starsCatalog[intersects[i].index!.toString()].V)) {
              index = intersects[i].index!.toString();
              Vmin = parseFloat(starsCatalog[intersects[i].index!.toString()].V);
            }
          })
          let pointerCoos = convertSphericalToCartesian(0.5, parseFloat(starsCatalog[index].ra), parseFloat(starsCatalog[index].dec));
          let g = pointerUI.geometry;
          let p = g.getAttribute('position');
          p.setXYZ(0, pointerCoos.x, pointerCoos.y, pointerCoos.z);
          p.needsUpdate = true;
          pointerUI.visible = true;
          setCurrentTapInfos(starsCatalog[index]);
          camera.updateProjectionMatrix();
        } else {
          setCurrentTapInfos(null);
          pointerUI.visible = false;
        }
      }
    });

  const gestures = Gesture.Simultaneous(pinch, pan);
  const taps = Gesture.Exclusive(singleTap);
  const composed = Gesture.Race(gestures, taps);

  return (
    <GestureHandlerRootView>
      <PlanetariumUI
        navigation={navigation}
        infos={currentTapInfos}
        onShowAzGrid={onShowAzGrid}
        onShowConstellations={onShowConstellations}
        onShowEqGrid={onShowEqGrid}
        onShowGround={onShowGround}
        onShowPlanets={() => { }}
        onShowDSO={() => { }}
        onCenterObject={() => {
          const formatedRa = typeof currentTapInfos.ra === 'string' ? convertHMSToDegreeFromString(currentTapInfos.ra) : currentTapInfos.ra;
          const formatedDec = typeof currentTapInfos.dec === 'string' ? convertDMSToDegreeFromString(currentTapInfos.dec) : currentTapInfos.dec;
          cameraRef.current!.lookAt(new THREE.Vector3(
            ...Object.values(convertSphericalToCartesian(10, formatedRa, formatedDec))
          ))
        }}
      />
      <GestureDetector gesture={composed}>
        <View style={planetariumStyles.container}>
          <GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} />
          {planetariumLoading && (
            <View style={planetariumStyles.loadingScreen}>
              <ActivityIndicator size="large" color={app_colors.white} />
              <Text style={{ color: app_colors.white }}>Loading...</Text>
            </View>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}