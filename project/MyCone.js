import {CGFobject} from '../lib/CGF.js';

export class MyCone extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const alphaAng = 2 * Math.PI / this.slices;

        // Laterais
        for (let i = 0; i < this.slices; i++) {
            const ang = i * alphaAng;
            const x = Math.cos(ang);
            const z = -Math.sin(ang);
        
            // vértice na base
            this.vertices.push(x, 0, z);
            this.normals.push(x, Math.cos(Math.PI / 4.0), z);
            this.texCoords.push((i / this.slices) * 2.5, 0);  // u varia de 0 a 2.5
            this.indices.push(i, (i + 1) % this.slices, this.slices);
        }

        // Vértice superior
        this.vertices.push(0, 1, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 1);

        // Base
        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i < this.slices; i++) {
            const ang = i * alphaAng;
            const x = Math.cos(ang);
            const z = -Math.sin(ang);

            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
            this.texCoords.push(
                0.5 + x * 0.5,
                0.5 + z * 0.5
            );

            this.indices.push(
                baseCenterIndex,
                baseCenterIndex + 1 + (i + 1) % this.slices,
                baseCenterIndex + 1 + i
            );
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity);
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
