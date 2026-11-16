import type { TFunction } from "i18next";
import { AstronomySession, SessionObservedObject } from "../../types/statistics/AstronomySession";
import { CatalogObjectSummary } from "../../types/catalog/CatalogObject";

export const getSessionMinutes = (session: AstronomySession): number => (session.endTime - session.startTime) / 60_000

export const getTotalObservationDuration = (sessions: AstronomySession[]): number => {
  return sessions.reduce((acc, session) => acc + getSessionMinutes(session), 0)
}

export const getTotalObservedObjects = (sessions: AstronomySession[]): number => {
  const totalObjects = sessions.reduce((acc, session) => {
    const sessionObjectsCount = session.observedObjects ? session.observedObjects.length : 0;
    return acc + sessionObjectsCount;
  }, 0);

  return totalObjects;
}

// Titre d'un objet du catalogue dans une liste d'objets observés : "M31 · Galaxie d'Andromède", ou
// la seule désignation quand l'objet n'a pas d'autre nom.
export const getCatalogObjectTitle = (catalogObject: CatalogObjectSummary): string =>
  catalogObject.name === catalogObject.primary ? catalogObject.primary : `${catalogObject.primary} · ${catalogObject.name}`

// "Galaxie · Messier" (catégorie + catalogue, déduit du préfixe de la désignation principale) —
// pas de catalogue déduit pour une désignation qui ne vient d'aucun des trois (ex: une étoile nommée).
// Catégories de l'API /v3/objects traduites dans le namespace du formulaire d'ajout, appelé
// explicitement (`ns:clé`) pour fonctionner avec le `t` de n'importe quel écran ; une catégorie
// inconnue s'affiche telle quelle (defaultValue). `t` est passée par le composant plutôt que de
// traduire au chargement du module : le libellé suit ainsi un changement de langue.
export const getCatalogObjectSubtitle = (catalogObject: CatalogObjectSummary, t: TFunction): string => {
  const categoryLabel = t(`tools/journal/sessions/add:observedObjects.categories.${catalogObject.category}`, { defaultValue: catalogObject.category })
  const catalogLabel = /^M\s?\d/.test(catalogObject.primary) ? "Messier"
    : /^NGC/i.test(catalogObject.primary) ? "NGC"
    : /^IC/i.test(catalogObject.primary) ? "IC"
    : null

  return [categoryLabel, catalogLabel].filter(Boolean).join(" · ")
}

// Nombre d'objets d'une session pour lesquels `flag` est coché (ex: combien ont été photographiés).
export const countObservedObjectsWith = (
  observedObjects: SessionObservedObject[],
  flag: "observedAtEyepiece" | "photographed" | "sketched"
): number => observedObjects.filter(entry => entry[flag]).length
