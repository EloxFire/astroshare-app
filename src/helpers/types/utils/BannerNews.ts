export type BannerNews = {
  _id: string
  title: string
  description: string
  icon: string
  colors: string // String of colors (hex) separated by semicolon exemple #FFFFFF;#000000
  type: 'internal' | 'external' | 'none'
  externalLink?: string
  internalRoute?: string
}