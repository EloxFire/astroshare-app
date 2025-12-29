import { convertHorizontalToEquatorial } from "@observerly/astrometry";
import { convertSphericalToCartesian } from "./convertSphericalToCartesian";
import * as THREE from "three";


export const getGlobePosition = (latitude: number, longitude: number, date: Date = new Date()): THREE.Vector3 => {
  const Zenith = { alt: 90, az: 0 };
  const { ra, dec } = convertHorizontalToEquatorial(date, { latitude, longitude }, Zenith);
  return convertSphericalToCartesian(5, ra, dec);
};
