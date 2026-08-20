import * as dotenv from "dotenv";
dotenv.config();

const IS_DEV = process.env.EXPO_PUBLIC_ENV === "dev";

// app.config.ts ne peut pas importer d'autres fichiers .ts du projet (ex: ./src/helpers/variables) :
// Expo ne transpile que ce fichier, pas ses imports transitifs, et le require() échoue au chargement
// de la config (expo config / expo start / eas build cassés). Garder les valeurs en dur ici.
const SPLASH_BACKGROUND_COLOR = "#F2D7FF"; // valeur figée ici, voir app_colors dans src/helpers/variables.ts

module.exports = {
  name: IS_DEV ? "DEV Astroshare" : "Astroshare",
  slug: "astroshare-app",
  version: "3.0.0",
  scheme: "astroshare",
  orientation: "portrait",
  icon: IS_DEV ? "./assets/icon-dev.png" : "./assets/icon.png",
  userInterfaceStyle: "light",
  owner: "eloxfire",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: SPLASH_BACKGROUND_COLOR,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    buildNumber: "20",
    supportsTablet: true,
    bundleIdentifier: IS_DEV
      ? "fr.eavagliano.astroshare.dev"
      : "fr.eavagliano.astroshare",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription:
        "Astroshare utilise votre position pour calculer les horaires de lever et coucher des astres, déterminer les objets visibles depuis votre emplacement et afficher l'horizon réel dans le planétarium 3D.",
      NSMotionUsageDescription:
        "Astroshare utilise les capteurs de mouvement de votre appareil pour détecter son orientation et synchroniser la vue du planétarium 3D avec la direction réelle vers laquelle vous pointez votre téléphone.",
      NSCameraUsageDescription:
        "Autoriser ${PRODUCT_NAME} à utiliser l'appareil photo pour scanner votre carte bancaire lors du paiement.",
      NSFaceIDUsageDescription:
        "Autoriser ${PRODUCT_NAME} à utiliser Face ID pour sécuriser vos paiements.",
      UIBackgroundModes: ["fetch"],
      LSApplicationQueriesSchemes: [
        "comgooglemaps",
        "googlemaps",
        "waze",
        "citymapper"
      ]
    },
    config: {
      useInsertionEffect: false
    }
  },
  android: {
    versionCode: 95,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000"
    },
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ??
      "./android/app/DEVgoogle-services.json",
    permissions: [
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.SCHEDULE_EXACT_ALARM"
    ],
    blockedPermissions: [
      "android.permission.ACTIVITY_RECOGNITION",
      "android.permission.CAMERA"
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    package: IS_DEV
      ? "fr.eavagliano.astroshare.dev"
      : "fr.eavagliano.astroshare",
    softwareKeyboardLayoutMode: "padding",
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "d66b5c83-1f63-4749-8eaf-68ebaeea3859"
    },
    appEnv: process.env.EXPO_PUBLIC_ENV ?? "production"
  },
  plugins: [
    "expo-router",
    "expo-image",
    "expo-sharing",
    "expo-status-bar",
    ["expo-asset"],
    ["expo-font"],
    [
      "expo-notifications",
      {
        icon: "./assets/icon.png",
        color: "#ffffff",
        defaultChannel: "default"
      }
    ],
    ["expo-localization"],
    [
      "expo-sensors",
      {
        motionPermission:
          "Astroshare utilise les capteurs de mouvement de votre appareil pour détecter son orientation et synchroniser la vue du planétarium 3D avec la direction réelle vers laquelle vous pointez votre téléphone."
      }
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Autoriser ${PRODUCT_NAME} à utiliser votre position.",
        isAndroidBackgroundLocationEnabled: false,
        isAndroidForegroundServiceEnabled: true
      }
    ],
    [
      "expo-build-properties",
      {
        usesClearTextTraffic: true
      }
    ]
  ]
};