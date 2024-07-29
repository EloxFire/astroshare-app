import * as dotenv from "dotenv";
dotenv.config();

module.exports = {
  name: "Astroshare",
  slug: "astroshare-app",
  version: "v1.0.2",
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
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000"
    },
    permissions: ["android.permission.ACCESS_FINE_LOCATION"],
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
    versionCode: 9
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
      "expo-sensors",
      {
        motionPermission: "Autoriser Astroshare à utiliser les capteurs de mouvement."
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
