export type ProPackage = {
  name: string;
  type: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  discount?: string;
}