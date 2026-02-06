export type Camera = {
  name: string;
  type: 'DSLR' | 'DEDICATED' | 'MOBILE';
  sensorSize: {
    width: number;
    height: number;
  },
  resolution: {
    width: number;
    height: number;
  },
  pixelSize: number;
  brand?: string;
  model?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}