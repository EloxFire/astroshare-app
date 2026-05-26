import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { TextureLoader } from 'expo-three';

const cache = new Map<number, Promise<THREE.Texture>>();

export const loadBundledTextureAsync = (moduleId: number): Promise<THREE.Texture> => {
  const cached = cache.get(moduleId);
  if (cached) return cached;

  const promise = (async () => {
    const asset = Asset.fromModule(moduleId);
    await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    if (!uri) throw new Error(`Missing local URI for asset ${asset.name}`);

    return new Promise<THREE.Texture>((resolve, reject) => {
      new TextureLoader().load(uri, resolve, undefined, reject);
    });
  })();

  cache.set(moduleId, promise);
  return promise;
};
