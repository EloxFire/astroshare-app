import * as THREE from "three";


export function getStarColor(code: string | null): number {
  // Définition des types stellaires dans l'ordre
  const spectralTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

  if(!code){
    return 0.5
  }

  // Gestion des cas null ou invalides
  if (!code) {
    console.log("Invalid code :", code)
    return 0.5; // Par défaut, 0.5 pour un code null
  }

  // Extraire la lettre et le chiffre du code
  const type = code[0]; // Lettre (O, B, A, etc.)
  const number = parseInt(code[1]); // Chiffre (0 à 9)

  // Vérifier si le type est valide
  const typeIndex = spectralTypes.indexOf(type);
  if (typeIndex === -1 || isNaN(number) || number < 0 || number > 9) {
    return 0.5; // Par défaut, 0.5 pour un code invalide
  }

  // Référence centrale (F8)
  const centerType = 'F';
  const centerNumber = 8;

  // Index du type central
  const centerIndex = spectralTypes.indexOf(centerType);

  // Échelle relative au centre (non linéaire)
  const relativeTypeIndex = typeIndex - centerIndex;
  const relativeNumber = number - centerNumber;

  // Nombre total de types
  const totalTypes = spectralTypes.length;

  // Échelle pour le type (non linéaire)
  const typeScale = Math.tanh(relativeTypeIndex / totalTypes); // Fonction tangente hyperbolique
  const numberScale = Math.tanh(relativeNumber / 9); // Fonction tangente hyperbolique

  // Combinaison des deux échelles, recentrée sur 0.5
  const scale = 0.5 + (typeScale + numberScale / totalTypes) / 2;

  // Clamping pour s'assurer que le résultat est entre 0 et 1
  return Math.max(0, Math.min(1, scale));
}


export const getStarMaterial = (): THREE.ShaderMaterial => {
    const vertexShader = `
	attribute float size;
  varying vec4 vPos;
  attribute vec4 color;
  varying vec4 vColor;
	void main() {
    vColor=color;
		vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		gl_Position = vPos;
    gl_PointSize=size;
	}
`
  const fragmentShader = `
  varying vec4 vPos;
  varying vec4 vColor;
  void main() {
    vec2 uv = (gl_PointCoord-.5*1.)/1.;

    vec4 col = vec4(0);
    
    float d = length(uv);
    float m = .01/d;
    
    col += m;
    col += vColor*.01/d;

    gl_FragColor = col;
  }`;

  const shader = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    blending: THREE.NormalBlending,
  });
  return shader;
};