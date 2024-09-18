import * as satellite from 'satellite.js';

export type SatellitePosition = {
  longitude: number,
  latitude: number,
  height: number
}

export const getSatelliteCoordsFromTLE = async (tle: string[]) => {
  // Exemple de TLE pour un satellite
  const tleLine0 = tle[0].trim();
  const tleLine1 = tle[1].trim();
  const tleLine2 = tle[2].trim();

  const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

  // console.log(satrec);

  // if(!satrec) return null;
  
  // Get the position of the satellite at the given date
  const date = new Date();
  const positionAndVelocity = satellite.propagate(satrec, date);
  const gmst = satellite.gstime(date);
  const position = satellite.eciToGeodetic(positionAndVelocity.position as any, gmst);

  console.log(tleLine0);
  
  // console.log(position.longitude);// in radians
  // console.log(position.latitude);// in radians
  console.log(position.height);// in km

  return {
    name: tleLine0,
    longitude: position.longitude,
    latitude: position.latitude,
    altitude: position.height
  }
  
}