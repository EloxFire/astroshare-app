export type ApodMediaType = "image" | "video";

export type Apod = {
  date: string; // format YYYY-MM-DD
  post_id: number;
  title: string;
  permalink: string; // URL de l'article science.nasa.gov
  media_type: ApodMediaType;
  explanation: string; // HTML (contient des balises <a>, <strong>, <br>...)
  credit?: string; // HTML - pas toujours présent
  copyright?: string; // HTML - absent pour la plupart des images (domaine public)
  alt: string;
  url: string;
  hdurl?: string; // absent quand media_type === "video"
}

export type ApodResponse = {
  data: Apod;
}
