import { THREE } from "expo-three";

export const createGround = () => {
    // Creation du sol
    const vertexShader = `
    varying vec4 vPos;
    void main() {
        vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position = vPos;
    }
  `
    const fragmentShader = `
    void main() {
        vec4 col = vec4(.5,0.,0.,.3);  
        gl_FragColor = col;
    }`;

    const groundShader = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        depthWrite: false,
        depthTest: true,
        transparent: true,
        blending: THREE.NormalBlending,
        opacity:1,
    });

    const Groundgeometry = new THREE.SphereGeometry(1, 64, 64, Math.PI, Math.PI, 0, Math.PI);
    groundShader.side = THREE.BackSide;
    let ground = new THREE.Mesh(Groundgeometry, groundShader);
    return (ground);
}