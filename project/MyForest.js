import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
    constructor(scene, rows, cols, width = 30, depth = 30, useTextures = false) {
        super(scene);
        this.rows = rows;
        this.cols = cols;
        this.width = width;
        this.depth = depth;
        this.useTextures = useTextures;
        this.trees = [];

        const spacingX = width / cols;
        const spacingZ = depth / rows;

        // Texturas do tronco
        this.trunkTextures = [
            "textures/trunk1.jpg",
            "textures/trunk2.jpg"
        ];

        // Texturas da copa
        this.foliageTextures = [
            "textures/leaves1.jpg",
            "textures/leaves2.jpg",
            "textures/leaves3.jpg"
        ];

        // Árvores
        for (let i = 0; i < rows; i++) {
            this.trees[i] = [];
            for (let j = 0; j < cols; j++) {
                // Parâmetros aleatórios para cada árvore
                const rotationDeg = Math.random() * 20 - 10;
                const rotationAxis = Math.random() < 0.5 ? 'X' : 'Z';
                const trunkBaseRadius = 0.5 + Math.random() * 0.1;
                const treeHeight = 15 + Math.random() * 3;
                const foliageColor = [
                    0.1 + Math.random() * 0.2,
                    0.4 + Math.random() * 0.3,
                    0.1 + Math.random() * 0.2
                ];

                const offsetX = (Math.random() - 0.5) * spacingX * 0.4;
                const offsetZ = (Math.random() - 0.5) * spacingZ * 0.4;

                // Posição da árvore
                const posX = -width / 2 + j * spacingX + spacingX / 2 + offsetX;
                const posZ = -depth / 2 + i * spacingZ + spacingZ / 2 + offsetZ;

                // Escolha de texturas
                const trunkAppearance = useTextures
                    ? this.randomFrom(this.trunkTextures)
                    : null;
                const foliageAppearance = useTextures
                    ? this.randomFrom(this.foliageTextures)
                    : null;

                const tree = new MyTree(
                    scene,
                    rotationDeg,
                    rotationAxis,
                    trunkBaseRadius,
                    treeHeight,
                    foliageColor,
                    trunkAppearance,
                    foliageAppearance
                );

                this.trees[i][j] = { tree, posX, posZ };
            }
        }
    }

    randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    display() {
        for (let row of this.trees) {
            for (let { tree, posX, posZ } of row) {
                this.scene.pushMatrix();
                this.scene.translate(posX, 0, posZ);
                tree.display();
                this.scene.popMatrix();
            }
        }
    }
}
