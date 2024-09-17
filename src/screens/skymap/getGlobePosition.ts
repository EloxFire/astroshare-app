import { convertHorizontalToEquatorial } from "@observerly/astrometry";
import { convertSphericalToCartesian } from "./convertSphericalToCartesian";

export const getGlobePosition = (latitude: number, longitude: number) => {
  const Zenith = { alt: 90, az: 0 }
  const { ra, dec } = convertHorizontalToEquatorial(new Date(), { latitude, longitude }, Zenith)
  return convertSphericalToCartesian(100, ra, dec);
}