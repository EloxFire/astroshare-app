import { Blend, BookIcon, BookSearchIcon, Boxes, BringToFront, Calculator, CameraIcon, CircleDotDashed, ClockIcon, CloudSun, CompassIcon, EclipseIcon, LucideLightbulb, MoonIcon, NotepadTextIcon, Orbit, Rocket, Rotate3d, Satellite, SpellCheck, StarsIcon, Sun, TrendingUp, Waypoints } from "lucide-react-native";
import { AstroshareTool } from "../../types/tools/astroshareTool";

export const toolsList: AstroshareTool[] = [
  // Moon phases calendar
  {
    toolId: "moon-phases-calendar",
    ToolIcon: MoonIcon, 
    category: "prepare",
    access: "free",
  },
  // Alignement polaire / Viseur polaire numérique
  {
    toolId: "polar-align",
    ToolIcon: CompassIcon, 
    category: "prepare",
    access: "free",
  },
  {
    toolId: "planetarium",
    ToolIcon: Orbit, 
    category: "observe",
    access: "free",
  },
  // Météo générale
  {
    toolId: "weather",
    ToolIcon: CloudSun, 
    category: "prepare",
    access: "free",
  },
  // Calculs astronomiques
  {
    toolId: "astro-calculations",
    ToolIcon: Calculator, 
    category: "observe",
    access: "free",
  },
  // Carte pollution lumineuse
  {
    toolId: "light-pollution-map",
    ToolIcon: LucideLightbulb, 
    category: "prepare",
    access: "premium",
  },
  // Statistiques d'observation
  {
    toolId: "user-stats",
    ToolIcon: TrendingUp, 
    category: "follow-up",
    access: "free",
  },
  // Glossaire / lexique astro
  {
    toolId: "astro-glossary",
    ToolIcon: SpellCheck, 
    category: "learn",
    access: "free",
  },
  // Satellite tracker
  {
    toolId: "satellite-tracker",
    ToolIcon: Satellite, 
    category: "observe",
    access: "freemium",
  },
  // Métée de l'espace / Soleil
  {
    toolId: "space-weather",
    ToolIcon: Sun, 
    category: "prepare",
    access: "freemium",
  },
  // APOD
  {
    toolId: "apod",
    ToolIcon: CameraIcon, 
    category: "follow-up",
    access: "free",
  },
  // Calendrier des lancements spatiaux
  {
    toolId: "space-launches",
    ToolIcon: Rocket, 
    category: "follow-up",
    access: "free",
  },
  // Horloges
  {
    toolId: "clocks",
    ToolIcon: ClockIcon, 
    category: "prepare",
    access: "free",
  },
  // Eclipses lunaires et solaires
  {
    toolId: "eclipses",
    ToolIcon: EclipseIcon, 
    category: "observe",
    access: "premium",
  },
  // Conjonctions planétaires / Conjonctions planètes-lune / Conjonctions entre deux astres donnés
  {
    toolId: "conjunctions-calculator",
    ToolIcon: Blend, 
    category: "observe",
    access: "freemium",
  },
  // Transits ISS
  {
    toolId: "iss-transits",
    ToolIcon: BringToFront, 
    category: "observe",
    access: "premium",
  },
  // Modèles 3D du système solaire / Lunes / Vaisseaux spatiaux / Astéroïdes / Comètes
  {
    toolId: "3d-viewer",
    ToolIcon: Rotate3d,
    category: "observe",
    access: "freemium",
  },
  // Listes a points / Todo lists / Checklists / Listes de contrôle
  {
    toolId: "checklists",
    ToolIcon: NotepadTextIcon,
    category: "prepare",
    access: "free",
  },
  // Simlateur de champ occulaire / caméra
  {
    toolId: "field-simulator",
    ToolIcon: CircleDotDashed,
    category: "observe",
    access: "free",
  },
  // Planificateur de nuit
  {
    toolId: "night-planner",
    ToolIcon: Waypoints,
    category: "prepare",
    access: "freemium",
  },
  // Fiches détaillées sur des objets notables / Messier / NGC / Planètes / Lunes / Astéroïdes / Comètes
  {
    toolId: "memo-sheets",
    ToolIcon: BookIcon,
    category: "learn",
    access: "free",
  },
  // 
]