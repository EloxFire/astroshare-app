# Astroshare (Application mobile)

🇫🇷 Astroshare est une application mobile qui propose des outils pratique d'astronomie. En un coup d'oeil, calculez la position d'un object céleste, la phase actuelle de la lune ou encore renseignez vous sur les conditions météo à vos coordonnées actuelles d'observation.

🇬🇧 Astroshare is a mobile application that offers practical astronomy tools. At a glance, calculate the position of a celestial object, the current phase of the moon or find out about the weather conditions at your current observation coordinates.


## Fonctionnalités

Astroshare rassemble tout ce dont les passionnés d'astronomie ont besoin dans une seule application intuitive et moderne. Que vous soyez un observateur novice ou un astronome expérimenté, cette application est conçue pour vous accompagner sous vos nuits étoilés.

🌍 Météo en direct : Obtenez des prévisions météorologiques optimisées pour l'observation astronomique et ne manquez plus jamais une nuit idéale.

🔭 Catalogue de 13 000 objets célestes : Recherchez et découvrez des planètes, étoiles, nébuleuses et galaxies en un instant.

🔧 Outil d'alignement polaire : Alignez votre télescope avec précision pour des observations optimales.

☀️ Météo solaire : Suivez l'activité solaire en temps réel, avec des prévisions d'aurores boréales et des images du Soleil.

🚀 Suivi de l'ISS : Sachez exactement quand et où observer la Station Spatiale Internationale.

📸 Image du jour de la NASA : Chaque jour, découvrez une nouvelle image spectaculaire de l'espace sélectionnée par la NASA.

⭐ Gestion des favoris : Sauvegardez et accédez rapidement à vos objets célestes préférés.

🎨 Personnalisation : Ajoutez des widgets et personnalisez Astroshare selon vos préférences.

Astroshare est conçu pour rendre l'astronomie accessible à tous, avec une interface intuitive et un design élégant. Planifiez vos nuits d'observation, suivez l'activité solaire, et explorez l'univers avec un compagnon moderne qui vous guide dans vos aventures célestes.

## Captures d'écran

Voici un aperçu de certains écrans de l'application :

![Captures d'ecran](https://i.postimg.cc/0j1Dwmgk/Screencaps-readme.png)

## Feedback

Si vous souhaitez effectuer un retour, trouvé un bug ou donner votre avis, merci de me contacter à l'adresse suivante : [contact@astroshare.fr](mailto:contact@astroshare.fr)

---

# EXPLICATIONS PLANETARIUM

## Variables utiles :
### StarCatalog
Le Stars catalog est un tableau qui récupère les étoiles directement depuis la base de donnée d'Astroshare (C'est ton ancient fichier que tu lisais avec FS), ici tu n'as plus à t'en occuper, les étoiles sont dispo a tout moment grace à la variable `starsCatalog`.
### currentUserLocation :
Te donne accès à la position actuelle de l'utilisateur, sous forme d'un objet avec les clés `lat` et `lon` pour la latitude et la longitude.
### createStarMaterial :
J'ai fait une fonction pour gérer les matériaux des étoiles, elle prend en paramètre un objet `Star` et retourne un `THREE.PointsMaterial` avec la couleur et la taille appropriée.

## Créaction de la scène 3D :
Le code définit une fonction asynchrone `_onContextCreate` qui initialise une scène 3D en utilisant la bibliothèque `three.js` dans une application React Native. Cette fonction est déclenchée lorsque le contexte WebGL est créé (`<GLView style={{ flex: 1 }} onContextCreate={_onContextCreate} /> tout en bas du fichier`).

Tout d'abord, la fonction récupère les dimensions du tampon de dessin à partir du contexte WebGL et met à jour les variables d'état `cameraWidth` et `cameraHeight` :
```typescript
const { drawingBufferWidth, drawingBufferHeight } = gl;
setCameraWidth(drawingBufferWidth);
setCameraHeight(drawingBufferHeight);
```

Ensuite, elle initialise la scène `three.js`, la caméra et le renderer. La caméra est configurée avec un champ de vision de 90 degrés et positionnée à l'origine :
```typescript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, drawingBufferWidth / drawingBufferHeight, 0.1, 50000);
const renderer = new ExpoTHREE.Renderer({ gl });
renderer.setSize(drawingBufferWidth, drawingBufferHeight);
renderer.setClearColor(0x080808);
camera.position.set(0, 0, 0);
```

Un `AxesHelper` est ajouté à la scène pour référence visuelle :
```typescript
const axesHelper = new THREE.AxesHelper(5);
sceneRef.current.add(axesHelper);
```

La fonction regroupe ensuite les étoiles par type de matériau pour un rendu efficace. Elle itère sur le `starsCatalog`, convertit les coordonnées équatoriales de chaque étoile en coordonnées horizontales, puis en coordonnées cartésiennes 3D. Ces coordonnées sont stockées dans un `Float32Array` pour chaque groupe de matériaux :
```typescript
starsCatalog.forEach((star, index) => {
  const { alt, az } = convertEquatorialToHorizontal(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: star.ra, dec: star.dec });
  const { x, y, z } = convertAltAzToXYZ(alt, az, 5);
  const starType = star.sp_type ? star.sp_type[0] : 'A';
  if (!materialGroups[starType]) {
    const positions = new Float32Array(starsCatalog.length * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    materialGroups[starType] = { positions, geometry };
  }
  const { positions } = materialGroups[starType];
  const i3 = index * 3;
  positions[i3] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;
});
```

Après avoir regroupé les étoiles, la fonction crée des objets `THREE.Points` pour chaque groupe de matériaux et les ajoute à la scène :
```typescript
Object.keys(materialGroups).forEach((starType) => {
  const { positions, geometry } = materialGroups[starType];
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMaterial = getStarMaterial({ sp_type: starType } as Star);
  const stars = new THREE.Points(geometry, starMaterial);
  scene.add(stars);
});
```

Une sphère rouge semi-transparente est créée pour représenter le sol et ajoutée à la scène. La caméra est tournée de 90 degrés pour ajuster son orientation :
```typescript
const Groundgeometry = new THREE.SphereGeometry(1, 64, 64, Math.PI, Math.PI, 0, Math.PI);
let material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
material.side = THREE.BackSide;
let ground = new THREE.Mesh(Groundgeometry, material);
camera.rotateX(90);
scene.add(ground);
```

Enfin, une boucle d'animation est définie pour rendre continuellement la scène. La fonction `requestAnimationFrame` est utilisée pour appeler la fonction `animate` de manière répétée, assurant un rendu fluide :
```typescript
const animate = () => {
  requestAnimationFrame(animate);
  if (rendererRef.current && sceneRef.current && cameraRef.current) {
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    gl.endFrameEXP();
  }
};
animate();
```

