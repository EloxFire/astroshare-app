import * as THREE from "three";

export const getStarMaterial = (): THREE.ShaderMaterial => {
  const uniform = {
  };

  const vertexShader = `
	attribute float size;
  varying vec4 vPos;
  
	void main() {
		vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		gl_Position = vPos;
    gl_PointSize=100.*size;
	}
`
  const fragmentShader = `
  varying vec4 vPos;
  uniform sampler2D pointTexture;
  void main() {
    // (fragCoord-.5*iResolution.xy)/iResolution.y
    vec2 uv = (gl_PointCoord-.5*1.)/1.;

    vec4 col = vec4(0);
    
    float d = length(uv);
    float m = .01/d;
    
    col += m;
    col += vec4(1,.5,.0,1.)*.01/d;

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