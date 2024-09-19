import * as satellite from 'satellite.js';

export type SatellitePosition = {
  longitude: number,
  latitude: number,
  altitude: number,
  name: string
}

export const getSatelliteCoordsFromTLE = async (tle: string[]) => {
  // Exemple de TLE pour un satellite
  const tleLine0 = tle[0].trim();
  const tleLine1 = tle[1].trim();
  const tleLine2 = tle[2].trim();

  const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
  
  // Get the position of the satellite at the given date
  const date = new Date();
  const positionAndVelocity = satellite.propagate(satrec, date);
  const gmst = satellite.gstime(date);
  if(!positionAndVelocity) return null;
  if(!positionAndVelocity.position) return null;
  if(typeof positionAndVelocity.position === 'boolean') return null;
  const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

  const formatedPosition: SatellitePosition = {
    name: tleLine0,
    longitude: position.longitude,
    latitude: position.latitude,
    altitude: position.height
  }  

  return formatedPosition
}