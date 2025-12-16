export const prettyRa = (ra: string | number) => {

  if (typeof ra === 'number') {
    const hours = Math.floor(ra);
    const minutes = Math.floor((ra - hours) * 60);
    const seconds = Math.floor(((ra - hours) * 60 - minutes) * 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return ra.replace(':', 'h ').replace(':', 'm ')
}

export const prettyDec = (dec: string | number) => {
  if (typeof dec === 'number') {
    const degrees = Math.floor(dec);
    const minutes = Math.floor((dec - degrees) * 60);
    const seconds = Math.floor(((dec - degrees) * 60 - minutes) * 60);
    return `${degrees}° ${minutes}' ${seconds}"`;
  }

  return dec.replace(':', '° ').replace(':', "' ") + '"'
}