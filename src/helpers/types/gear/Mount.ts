export type Mount = {
  id: string;
  name: string;
  type: string;
  gearType: 'mount';
  brand?: string;
  model?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}