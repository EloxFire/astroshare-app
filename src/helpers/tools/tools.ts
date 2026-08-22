import { Blend, BookIcon, BookSearchIcon, Boxes, BringToFront, Calculator, CameraIcon, CircleDotDashed, ClockIcon, CloudSun, CompassIcon, EclipseIcon, LucideLightbulb, MoonIcon, NotepadTextIcon, Orbit, Rocket, Rotate3d, Satellite, SpellCheck, StarsIcon, Sun, TrendingUp, Waypoints } from "lucide-react-native";
import { AstroshareTool } from "../../types/tools/astroshareTool";

export const toolsList: AstroshareTool[] = [
  // Moon phases calendar
  {
    toolId: "moon-phases-calendar",
    toolName: "Lune",
    ToolIcon: MoonIcon, 
    category: "prepare",
    access: "free",
  },
  // Alignement polaire / Viseur polaire numérique
  {
    toolId: "polar-align",
    toolName: "Viseur polaire",
    ToolIcon: CompassIcon, 
    category: "prepare",
    access: "free",
  },
  {
    toolId: "planetarium",
    toolName: "Planétarium",
    ToolIcon: Orbit, 
    category: "observe",
    access: "free",
  },
  // Météo générale
  {
    toolId: "weather",
    toolName: "Météo",
    ToolIcon: CloudSun, 
    category: "prepare",
    access: "free",
  },
  // Calculs astronomiques
  {
    toolId: "astro-calculations",
    toolName: "Calculs",
    ToolIcon: Calculator, 
    category: "observe",
    access: "free",
  },
  // Carte pollution lumineuse
  {
    toolId: "light-pollution-map",
    toolName: "Pollution lumineuse",
    ToolIcon: LucideLightbulb, 
    category: "prepare",
    access: "premium",
  },
  // Statistiques d'observation
  {
    toolId: "user-stats",
    toolName: "Statistiques",
    ToolIcon: TrendingUp, 
    category: "follow-up",
    access: "free",
  },
  // Glossaire / lexique astro
  {
    toolId: "astro-glossary",
    toolName: "Glossaire",
    ToolIcon: SpellCheck, 
    category: "learn",
    access: "free",
  },
  // Satellite tracker
  {
    toolId: "satellite-tracker",
    toolName: "Suivi satellite",
    ToolIcon: Satellite, 
    category: "observe",
    access: "freemium",
  },
  // Métée de l'espace / Soleil
  {
    toolId: "space-weather",
    toolName: "Météo de l'espace",
    ToolIcon: Sun, 
    category: "prepare",
    access: "freemium",
  },
  // APOD
  {
    toolId: "apod",
    toolName: "APOD",
    ToolIcon: CameraIcon, 
    category: "follow-up",
    access: "free",
  },
  // Calendrier des lancements spatiaux
  {
    toolId: "space-launches",
    toolName: "Lancements spatiaux",
    ToolIcon: Rocket, 
    category: "follow-up",
    access: "free",
  },
  // Horloges
  {
    toolId: "clocks",
    toolName: "Horloges",
    ToolIcon: ClockIcon, 
    category: "prepare",
    access: "free",
  },
  // Eclipses lunaires et solaires
  {
    toolId: "eclipses",
    toolName: "Éclipses",
    ToolIcon: EclipseIcon, 
    category: "observe",
    access: "premium",
  },
  // Conjonctions planétaires / Conjonctions planètes-lune / Conjonctions entre deux astres donnés
  {
    toolId: "conjunctions-calculator",
    toolName: "Conjonctions",
    ToolIcon: Blend, 
    category: "observe",
    access: "freemium",
  },
  // Transits ISS
  {
    toolId: "iss-transits",
    toolName: "Transits ISS",
    ToolIcon: BringToFront, 
    category: "observe",
    access: "premium",
  },
  // Modèles 3D du système solaire / Lunes / Vaisseaux spatiaux / Astéroïdes / Comètes
  {
    toolId: "3d-viewer",
    toolName: "Modèles 3D",
    ToolIcon: Rotate3d,
    category: "observe",
    access: "freemium",
  },
  // Listes a points / Todo lists / Checklists / Listes de contrôle
  {
    toolId: "checklists",
    toolName: "Checklists",
    ToolIcon: NotepadTextIcon,
    category: "prepare",
    access: "free",
  },
  // Simlateur de champ occulaire / caméra
  {
    toolId: "field-simulator",
    toolName: "Simulateur de champ",
    ToolIcon: CircleDotDashed,
    category: "observe",
    access: "free",
  },
  // Planificateur de nuit
  {
    toolId: "night-planner",
    toolName: "Planificateur de nuit",
    ToolIcon: Waypoints,
    category: "prepare",
    access: "freemium",
  },
  // Fiches détaillées sur des objets notables / Messier / NGC / Planètes / Lunes / Astéroïdes / Comètes
  {
    toolId: "memo-sheets",
    toolName: "Fiches détaillées",
    ToolIcon: BookIcon,
    category: "learn",
    access: "free",
  },
  // 
]