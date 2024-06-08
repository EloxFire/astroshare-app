export const prettyRa = (ra: string) => {
  return ra.replace(':', 'h ').replace(':', 'm ') + 's'
}

export const prettyDec = (dec: string) => {
  return dec.replace(':', '° ').replace(':', "' ") + '"'
}