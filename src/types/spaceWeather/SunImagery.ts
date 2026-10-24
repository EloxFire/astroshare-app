export type SunImage = {
  wavelength: string;
  label: string; // déjà en FR, prêt à afficher
  imageUrl: string;
  animationUrl: string; // .mp4, boucle silencieuse
}

export type SunCorona = {
  label: string;
  time_tag: string;
  imageUrl: string;
  animationUrl: string; // .mp4, boucle 24h
}

export type SunImagery = {
  images: SunImage[]; // 10 longueurs d'onde
  corona: SunCorona;
}
