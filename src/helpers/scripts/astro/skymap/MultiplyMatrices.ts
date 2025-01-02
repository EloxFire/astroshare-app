export const MultiplyMatrices = (matrix1: number[][], matrix2: number[][]) => {
    const dimensions1 = { height: matrix1.length, width: matrix1[0].length };
    const dimensions2 = { height: matrix2.length, width: matrix2[0].length };
    
    //Check for matrices compatibility:
    if (dimensions1.width != dimensions2.height) {
        console.log("matrices not compatible!");
        return;
    }

    const resultDimensions = { height: dimensions1.height, width: dimensions2.width };
    const resultMatrix: number[][] = [];
    for (let row = 0; row != resultDimensions.height; row += 1) {
        const resultRow = [];
        for (let column = 0; column != resultDimensions.width; column += 1) {
            const matrix1Row = matrix1[row];
            let dotProduct = 0;
            for (const [i, rowNum] of matrix1Row.entries()) {
                const colNum = matrix2[i][column];
                dotProduct += rowNum * colNum;
            }
            resultRow.push(dotProduct);
        }
        resultMatrix.push(resultRow);
    }
    return resultMatrix;
}