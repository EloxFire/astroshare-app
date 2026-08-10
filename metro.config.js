const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

// Firebase/Expo SDK 53 workaround metro.config.js
defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.unstable_enablePackageExports = false;

// react-native-svg-transformer : les .svg deviennent des composants React
// (import Logo from './logo.svg') au lieu d'assets binaires opaques.
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg');
defaultConfig.resolver.sourceExts.push('svg');

module.exports = defaultConfig;
