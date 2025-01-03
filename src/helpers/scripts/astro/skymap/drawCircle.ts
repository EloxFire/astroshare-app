import { THREE } from "expo-three";
import { MultiplyMatrices } from "./MultiplyMatrices";

export const drawCircle = (radius: THREE.Vector3, position: THREE.Vector3, rotAxis: THREE.Vector3, color:number) => {
    const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true
    });
    let points = [];
    const axis = rotAxis.normalize();
    for (let i = 0; i <= Math.PI * 2; i = i + Math.PI / 64) {
        const c = Math.cos(i);
        const s = Math.sin(i);
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const rotationMatrix: number[][] = [
            [(x ) * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s],
            [x * y * (1 - c) + z * s, (y ) * (1 - c) + c, y * z * (1 - c) - x * s],
            [x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, (z ) * (1 - c) + c]
        ]; //matrice de roation d'angle theta=i autour de l'axe
        const VecToBeRotated: number[][] = [
            [radius.x],
            [radius.y],
            [radius.z]
        ];
        let rotatedVector = MultiplyMatrices(rotationMatrix, VecToBeRotated);
        // console.log(rotatedVector);
        if (rotatedVector) {
            let pointOfCircle = new THREE.Vector3(rotatedVector[0][0] + position.x, rotatedVector[1][0] + position.y, rotatedVector[2][0] + position.z);
            points.push(pointOfCircle);
        }
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    // console.log(points);

    return line;
}
