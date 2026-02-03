const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

// Firebase/Expo SDK 53 workaround metro.config.js
defaultConfig.resolver.sourceExts.push('cjs');
// defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;