import { DMSCoords } from "../types/DMSCoords";

export const convertDDtoDMS = (latitude: number, longitude: number): DMSCoords  => {
    const latCardinal = (latitude >= 0) ? 'N' : 'S';
    const lonCardinal = (longitude >= 0) ? 'E' : 'W';

    const latDegree = Math.floor(Math.abs(latitude));
    const latMinute = Math.floor((Math.abs(latitude) - latDegree) * 60);
    const latSecond = ((Math.abs(latitude) - latDegree - (latMinute / 60)) * 3600).toFixed(2);

    const lonDegree = Math.floor(Math.abs(longitude));
    const lonMinute = Math.floor((Math.abs(longitude) - lonDegree) * 60);
    const lonSecond = ((Math.abs(longitude) - lonDegree - (lonMinute / 60)) * 3600).toFixed(2);

    return {
        dms_lat: latDegree + '° ' + latMinute + "' " + latSecond + '" ' + latCardinal,
        dms_lon: lonDegree + '° ' + lonMinute + "' " + lonSecond + '" ' + lonCardinal
    };
}