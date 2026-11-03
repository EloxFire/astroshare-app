import { ThreeDModel, ThreeDModelCategory } from "../../types/tools/3dViewer";


export const threeDModelsCategories: ThreeDModelCategory[] = [
  {
    id: "solarsystem",
  },
  {
    id: 'space-probes',
  },
  {
    id: "satellites",
  },
  {
    id: "launchers",
  }
]


export const threeDModelsList: ThreeDModel[] = [
  {
    id: "sun",
    category: "solarsystem",
  },
  {
    id: "earth",
    category: "solarsystem"
  },
  {
    id: "moon",
    category: "solarsystem"
  },
  {
    id: "voyager-1",
    category: "space-probes"
  },
  {
    id: "ariane-6",
    category: "launchers"
  },
]