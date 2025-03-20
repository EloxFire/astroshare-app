export type ProPackage = {
  name: string;
  type: string;
  price: number;
  stripePrice: number;
  description: string;
  features: string[];
  discount?: string;
}