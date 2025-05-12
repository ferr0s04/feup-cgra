import { CGFobject } from '../lib/CGF.js';

export class MyPolygon extends CGFobject {
    constructor(scene, slices) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const alphaAng = 2 * Math.PI / this.slices;

        // Center of the polygon
        const centerIndex = 0;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 1, 0); // Up normal
        this.texCoords.push(0.5, 0.5);

        // Store outer vertices indices
        const outerIndices = [];

        for (let i = 0; i < this.slices; i++) {
            const ang = i * alphaAng;
            const x = Math.cos(ang);
            const z = Math.sin(ang);

            this.vertices.push(x, 0, z);
            this.normals.push(0, 1, 0); // Upward normal
            this.texCoords.push(0.5 + x * 0.5, 0.5 - z * 0.5);

            outerIndices.push(i + 1);
        }

        // Top face indices (visible from above)
        for (let i = 0; i < this.slices; i++) {
            const current = outerIndices[i];
            const next = outerIndices[(i + 1) % this.slices];
            this.indices.push(centerIndex, next, current);
        }

        // --- Bottom face (reverse winding + downward normals) ---
        const bottomCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);                 // duplicate center
        this.normals.push(0, -1, 0);                // down
        this.texCoords.push(0.5, 0.5);

        const bottomOuterIndices = [];
        for (let i = 0; i < this.slices; i++) {
            const ang = i * alphaAng;
            const x = Math.cos(ang);
            const z = Math.sin(ang);

            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0); // down
            this.texCoords.push(0.5 + x * 0.5, 0.5 - z * 0.5);

            bottomOuterIndices.push(bottomCenterIndex + 1 + i);
        }

        for (let i = 0; i < this.slices; i++) {
            const current = bottomOuterIndices[i];
            const next = bottomOuterIndices[(i + 1) % this.slices];
            this.indices.push(bottomCenterIndex, current, next); // reverse winding
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
