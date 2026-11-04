import type { ExpoWebGLRenderingContext } from "expo-gl";

// expo-gl ne gère que deux paramètres de gl.pixelStorei (UNPACK_FLIP_Y_WEBGL, UNPACK_ALIGNMENT —
// voir EXWebGLMethods.cpp) : pour tous les autres, que three.js envoie à l'init et à chaque envoi
// de texture, il ne fait rien d'autre que logger "EXGL: gl.pixelStorei() doesn't support this
// parameter yet!" (un console.log natif, impossible à filtrer via LogBox). On ne lui transmet donc
// que ceux-là : même rendu, sans le log. Même procédé que les wrappers de log d'expo-gl (GLUtils) :
// une fonction posée sur l'instance, qui appelle la méthode d'origine avec gl en `this` (le natif
// retrouve son contexte grâce à lui). Partagé par tout composant three.js/expo-gl (MoonPhase,
// Model3DViewer, ...) : le problème vient d'expo-gl, pas d'une scène en particulier.
export const filterUnsupportedPixelStorei = (gl: ExpoWebGLRenderingContext) => {
  const pixelStorei = gl.pixelStorei;
  gl.pixelStorei = (pname, param) => {
    if (pname === gl.UNPACK_FLIP_Y_WEBGL || pname === gl.UNPACK_ALIGNMENT) {
      pixelStorei.call(gl, pname, param);
    }
  };
};
