const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const packageSource = path.join(monorepoRoot, 'packages', 'react-native-tweet', 'src', 'index.ts');
const appReact = path.resolve(projectRoot, 'node_modules/react');
const appReactNative = path.resolve(projectRoot, 'node_modules/react-native');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [path.join(monorepoRoot, 'packages', 'react-native-tweet'), ...(config.watchFolders || [])];

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver = {
  ...config.resolver,
  unstable_enableSymlinks: true,
  unstable_enablePackageExports: true,
  extraNodeModules: {
    react: appReact,
    'react-native': appReactNative,
  },
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName === 'react-native-tweet') {
      return { filePath: packageSource, type: 'sourceFile' };
    }
    if (moduleName === 'react') {
      return { filePath: path.join(appReact, 'index.js'), type: 'sourceFile' };
    }
    if (moduleName === 'react-native') {
      return { filePath: path.join(appReactNative, 'index.js'), type: 'sourceFile' };
    }
    return defaultResolveRequest
      ? defaultResolveRequest(context, moduleName, platform)
      : context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
