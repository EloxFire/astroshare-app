import * as THREE from "three";


export function getStarColor(code: string): number {
  const spectralTypes = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
  const type = code[0]; // Lettre (O, B, A, etc.)
  const number = parseInt(code[1]); // Chiffre (0 à 9)

  const typeIndex = spectralTypes.indexOf(type);
  if (typeIndex === -1 || isNaN(number) || number < 0 || number > 9) {
    throw new Error('Code stellaire invalide : ' + code);
  }

  const totalTypes = spectralTypes.length;
  const typeScale = typeIndex / (totalTypes - 1);
  const numberScale = number / 9;

  return (typeScale + numberScale / totalTypes);
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