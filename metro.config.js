// metro.config.js – SDK 53+
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// 1. Indiquer à Metro qu’il peut charger les fichiers CommonJS (.cjs)
config.resolver.sourceExts.push('cjs');

// 2. Désactiver l’algorithme « package.exports » encore instable
config.resolver.unstable_enablePackageExports = false;

module.exports = config;