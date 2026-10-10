import { ApodMediaType } from "./Apod";

export type FutureApodNavigation = {
  title: string;
  url: string;
}

export type FutureApod = {
  id: number;
  title: string;
  slug: string;
  status: string; // "future" observé sur cet endpoint
  post_date: string; // heure locale, format "YYYY-MM-DD HH:mm:ss"
  post_date_gmt: string; // même format, en UTC
  link: string;
  featured_image: string;
  video_url: string; // chaîne vide quand media_type === "image"
  media_type: ApodMediaType;
  credit?: string; // HTML - pas toujours présent
  copyright?: string; // HTML - absent pour la plupart des images (domaine public)
  alt: string;
  // Toujours présents en tant qu'objets, même sans entrée adjacente (title/url vides plutôt que
  // l'objet absent/null).
  next_apod: FutureApodNavigation;
  previous_apod: FutureApodNavigation;
}

export type FutureApodResponse = {
  data: FutureApod[];
}
