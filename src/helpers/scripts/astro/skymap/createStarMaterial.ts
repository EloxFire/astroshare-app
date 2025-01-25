import * as THREE from "three";


export function getStarColor(code: string): number {
  // Définition des types stellaires dans l'ordre
  const spectralTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
  if (!code) {
    return 0.5; // Par défaut, 0.5 pour un code null
  }
  // Extraire la lettre et le chiffre du code
  const type = code[0]; // Lettre (O, B, A, etc.)
  const number = parseInt(code[1]); // Chiffre (0 à 9)

  // Vérifier si le type est valide
  const typeIndex = spectralTypes.indexOf(type);
  if (typeIndex === -1 || isNaN(number) || number < 0 || number > 9) {
    console.warn('code invalide'+code);
    return 0.5;
  }

  // Référence centrale (F8)
  const centerType = 'F';
  const centerNumber = 8;

  // Index du type central
  const centerIndex = spectralTypes.indexOf(centerType);

  // Échelle relative au centre
  const relativeTypeIndex = typeIndex - centerIndex;
  const relativeNumber = number - centerNumber;

  // Nombre total de types (pour normalisation)
  const totalTypes = spectralTypes.length;

  // Calcul de l'échelle centrée sur 0.5
  const typeScale = relativeTypeIndex / (totalTypes - 1); // Échelle relative au type
  const numberScale = relativeNumber / 9; // Échelle relative au chiffre

  // Combinaison des deux échelles
  const scale = 0.5 + (typeScale + numberScale / totalTypes) / 2;

  // Clamping pour s'assurer que le résultat est entre 0 et 1
  return Math.max(0, Math.min(1, scale));
}


export const getStarMaterial = (): THREE.ShaderMaterial => {
  const uniform = {
  };

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
  uniform sampler2D pointTexture;
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
    uniforms: uniform,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    depthWrite: false,
    transparent: true,
    blending: THREE.NormalBlending,
  });
  return shader;
};