import { ThreeDModel, ThreeDModelCategory } from "../../types/tools/3dViewer";
import { app_colors } from "../variables";


export const threeDModelsCategories: ThreeDModelCategory[] = [
  {
    id: "solarsystem",
    color: app_colors.accent.light
  },
  {
    id: 'space-probes',
    color: app_colors.yellow.light
  },
  {
    id: "satellites",
    color: app_colors.white
  },
  {
    id: "launchers",
    color: app_colors.accent.light
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
    id: "mars",
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
  {
    id: "starlink",
    category: "satellites"
  },
  {
    id: "hubble",
    category: "satellites"
  },
  {
    id: "iss",
    category: "satellites"
  }
]