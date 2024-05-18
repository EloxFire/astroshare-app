export type TViewPoint = {
  title: string;
  equipments: {
    electricity: boolean,
    parking: boolean,
    shelter: boolean,
    tools: boolean,
    altitude: string
    polarView: boolean
  }
}

export type Equipment = {
  title: string;
  icon: 'electricity' | 'parking' | 'shelter' | 'tools' | 'altitude' | 'polarView';
  value: boolean | string;
}