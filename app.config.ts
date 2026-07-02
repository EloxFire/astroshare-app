import * as dotenv from "dotenv";
import { useInsertionEffect } from "react";
dotenv.config();

module.exports = {
  name: "Astroshare",
  slug: "astroshare-app",
  version: "2.7.3",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  owner: "eloxfire",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "fr.eavagliano.astroshare",
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false,
      "NSLocationWhenInUseUsageDescription": "Astroshare utilise votre position pour calculer les horaires de lever et coucher des astres, déterminer les objets visibles depuis votre emplacement et afficher l'horizon réel dans le planétarium 3D.",
      "NSMotionUsageDescription": "Astroshare utilise les capteurs de mouvement de votre appareil pour détecter son orientation et synchroniser la vue du planétarium 3D avec la direction réelle vers laquelle vous pointez votre téléphone.",
      "NSCameraUsageDescription": "Autoriser ${PRODUCT_NAME} à utiliser l'appareil photo pour scanner votre carte bancaire lors du paiement.",
      "NSFaceIDUsageDescription": "Autoriser ${PRODUCT_NAME} à utiliser Face ID pour sécuriser vos paiements.",
      "UIBackgroundModes": ["fetch"],
      "LSApplicationQueriesSchemes": ["comgooglemaps", "googlemaps", "waze", "citymapper"]
    },
    config:{
      useInsertionEffect: false,
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000"
    },
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./android/app/DEVgoogle-services.json",
    permissions: [
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.SCHEDULE_EXACT_ALARM", // For android 12+ to schedule notifications
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
    package: "fr.eavagliano.astroshare",
    softwareKeyboardLayoutMode: "pan"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "d66b5c83-1f63-4749-8eaf-68ebaeea3859"
    }
  },
  plugins: [
    [
      "expo-asset"
    ],
    [
      "expo-font"
    ],
    [
      'expo-notifications',
      {
        "icon": "./assets/icon.png",
        "color": "#ffffff",
        "defaultChannel": "default",
      }
    ],
    [
      "expo-localization"
    ],
    [
      "expo-sensors",
      {
        motionPermission: "Astroshare utilise les capteurs de mouvement de votre appareil pour détecter son orientation et synchroniser la vue du planétarium 3D avec la direction réelle vers laquelle vous pointez votre téléphone."
      }
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Autoriser ${PRODUCT_NAME} à utiliser votre position.",
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
}
