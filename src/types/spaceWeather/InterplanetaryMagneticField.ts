export type ImfPoint = {
  time_tag: string;
  bt: number; // nT, intensité totale
  bz: number; // nT, composante nord/sud — négatif = favorable aux aurores
  auroraFavorable: boolean;
  label: string; // déjà en FR, prêt à afficher
}

export type ImfData = {
  current: ImfPoint;
  history: ImfPoint[]; // ~2h de points
}
