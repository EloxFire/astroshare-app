export const extractNumbers = (text: string): number => {
  const regex = /\d+/g
  const numbers = text.match(regex)
  const result = numbers?.join('') || ''
  return parseInt(result);
}