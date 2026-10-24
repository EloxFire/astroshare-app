import { Blend, BookIcon, BringToFront, Calculator, CameraIcon, CircleDotDashed, ClockIcon, CloudSun, CompassIcon, EclipseIcon, LucideLightbulb, MoonIcon, NotepadTextIcon, Orbit, Rocket, Rotate3d, Satellite, SpellCheck, Sun, TrendingUp, Waypoints } from "lucide-react-native";
import { AstroshareTool } from "../../types/tools/astroshareTool";

export const toolsList: AstroshareTool[] = [
  // Moon phases calendar
  {
    id: "moon-phases-calendar",
    icon: MoonIcon,
    category: "prepare",
    access: "free",
    route: "/tools/moon-calendar",
    
  },
  // Alignement polaire / Viseur polaire numérique
  {
    id: "polar-scope",
    icon: CompassIcon, 
    category: "prepare",
    access: "free",
    route: "/tools/polar-scope",
  },
  {
    id: "planetarium",
    icon: Orbit, 
    category: "observe",
    access: "free",
    route: "/tools/planetarium",
  },
  // Météo générale
  {
    id: "weather",
    icon: CloudSun, 
    category: "prepare",
    access: "free",
    route: "/tools/weather",
  },
  // Calculs astronomiques
  {
    id: "astro-calculations",
    icon: Calculator, 
    category: "observe",
    access: "free",
    route: "/tools/astro-calculations",
  },
  // Carte pollution lumineuse
  {
    id: "light-pollution-map",
    icon: LucideLightbulb, 
    category: "prepare",
    access: "premium",
    route: "/tools/light-pollution-map",
  },
  // Statistiques d'observation
  {
    id: "user-stats",
    icon: TrendingUp, 
    category: "follow-up",
    access: "free",
    route: "/tools/user-stats",
  },
  // Glossaire / lexique astro
  {
    id: "astro-glossary",
    icon: SpellCheck, 
    category: "learn",
    access: "free",
    route: "/tools/astro-glossary",
  },
  // Satellite tracker
  {
    id: "satellite-tracker",
    icon: Satellite, 
    category: "observe",
    access: "freemium",
    route: "/tools/satellite-tracker",
  },
  // Métée de l'espace / Soleil
  {
    id: "space-weather",
    icon: Sun, 
    category: "prepare",
    access: "freemium",
    route: "/tools/space-weather",
  },
  // APOD
  {
    id: "apod",
    icon: CameraIcon, 
    category: "follow-up",
    access: "free",
    route: "/tools/apod",
  },
  // Calendrier des lancements spatiaux
  {
    id: "space-launches",
    icon: Rocket, 
    category: "follow-up",
    access: "free",
    route: "/tools/space-launches",
  },
  // Horloges
  {
    id: "clocks",
    icon: ClockIcon, 
    category: "prepare",
    access: "free",
    route: "/tools/clocks",
  },
  // Eclipses lunaires et solaires
  {
    id: "eclipses",
    icon: EclipseIcon, 
    category: "observe",
    access: "premium",
    route: "/tools/eclipses",
  },
  // Conjonctions planétaires / Conjonctions planètes-lune / Conjonctions entre deux astres donnés
  {
    id: "conjunctions-calculator",
    icon: Blend, 
    category: "observe",
    access: "freemium",
    route: "/tools/conjunctions-calculator",
  },
  // Transits ISS
  {
    id: "iss-transits",
    icon: BringToFront, 
    category: "observe",
    access: "premium",
    route: "/tools/iss-transits",
  },
  // Modèles 3D du système solaire / Lunes / Vaisseaux spatiaux / Astéroïdes / Comètes
  {
    id: "3d-viewer",
    icon: Rotate3d,
    category: "observe",
    access: "freemium",
    route: "/tools/3d-viewer",
  },
  // Listes a points / Todo lists / Checklists / Listes de contrôle
  {
    id: "checklists",
    icon: NotepadTextIcon,
    category: "prepare",
    access: "free",
    route: "/tools/checklists",
  },
  // Simlateur de champ occulaire / caméra
  {
    id: "field-simulator",
    icon: CircleDotDashed,
    category: "observe",
    access: "free",
    route: "/tools/field-simulator",
  },
  // Planificateur de nuit
  {
    id: "night-planner",
    icon: Waypoints,
    category: "prepare",
    access: "freemium",
    route: "/tools/night-planner",
  },
  // Fiches détaillées sur des objets notables / Messier / NGC / Planètes / Lunes / Astéroïdes / Comètes
  {
    id: "memo-sheets",
    icon: BookIcon,
    category: "learn",
    access: "free",
    route: "/tools/memo-sheets",
  },
  // 
]