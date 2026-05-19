import * as THREE from 'three';
import {Asset} from 'expo-asset';
import {TextureLoader} from 'expo-three';

const bundledTextureCache = new Map<number, Promise<THREE.Texture>>();

export const loadBundledTextureAsync = (moduleId: number): Promise<THREE.Texture> => {
  const cachedTexture = bundledTextureCache.get(moduleId);
  if (cachedTexture) {
    return cachedTexture;
  }

  const texturePromise = (async () => {
    const asset = Asset.fromModule(moduleId);
    await asset.downloadAsync();

    const assetUri = asset.localUri ?? asset.uri;
    if (!assetUri) {
      throw new Error(`Missing local URI for bundled asset ${asset.name}`);
    }

    return await new Promise<THREE.Texture>((resolve, reject) => {
      new TextureLoader().load(
        assetUri,
        (texture) => resolve(texture),
        undefined,
        (error) => reject(error)
      );
    });
  })();

  bundledTextureCache.set(moduleId, texturePromise);
  return texturePromise;
};
