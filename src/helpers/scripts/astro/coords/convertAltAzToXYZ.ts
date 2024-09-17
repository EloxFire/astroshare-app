import { degToRadians } from "../../utils/math/convertDegreesToRadians";

export const convertAltAzToXYZ = (alt: number, az: number, radius: number) => {
  const altRad = degToRadians(alt);
  const azRad = degToRadians(az);

  const x = radius * Math.cos(altRad) * Math.sin(azRad);
  const y = radius * Math.sin(altRad);
  const z = radius * Math.cos(altRad) * Math.cos(azRad);

  return { x, y, z };
};