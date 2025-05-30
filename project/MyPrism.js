import { CGFobject } from '../lib/CGF.js';

export class MyPrism extends CGFobject {
    constructor(scene, stacks, offsetX = 0) {
        super(scene);
        this.stacks = stacks;
        this.offsetX = offsetX;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let index = 0;
        const zStep = 1 / this.stacks;

        const basePoints = [
            [0, 0], // 0
            [0, 1], // 1
            [1, 0], // 2
            [1, 1]  // 3
        ];

        const edges = [
            [0, 1],
            [1, 3],
            [3, 2],
            [2, 0]
        ];

        for (let i = 0; i < edges.length; i++) {
            const [startIdx, endIdx] = edges[i];
            const [x1, y1] = basePoints[startIdx];
            const [x2, y2] = basePoints[endIdx];

            const dx = x2 - x1;
            const dy = y2 - y1;
            const normalX = -dy;
            const normalY = dx;
            const length = Math.hypot(normalX, normalY);
            const nx = normalX / length;
            const ny = normalY / length;

            for (let j = 0; j < this.stacks; j++) {
                const z0 = j * zStep;
                const z1 = (j + 1) * zStep;

                this.vertices.push(
                    x1, y1, z0,
                    x2, y2, z0,
                    x1 + this.offsetX, y1, z1,
                    x2 + this.offsetX, y2, z1
                );

                const u0 = x1;
                const v0 = z0;
                const u1 = x2;
                const v1 = z0;
                const u2 = x1 + this.offsetX;
                const v2 = z1;
                const u3 = x2 + this.offsetX;
                const v3 = z1;

                this.texCoords.push(u0, v0, u1, v1, u2, v2, u3, v3);

                this.indices.push(
                    index + 1, index, index + 2,
                    index + 2, index + 3, index + 1
                );

                for (let k = 0; k < 4; k++) {
                    this.normals.push(nx, ny, 0);
                }

                index += 4;
            }
        }

        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0.5, 0.5, 0);
        this.normals.push(0, 0, -1);

        for (let i = 0; i < 4; i++) {
            const [x, y] = basePoints[i];
            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(x, y);
        }

        this.indices.push(baseCenterIndex, baseCenterIndex + 1, baseCenterIndex + 2);
        this.indices.push(baseCenterIndex, baseCenterIndex + 2, baseCenterIndex + 4);
        this.indices.push(baseCenterIndex, baseCenterIndex + 4, baseCenterIndex + 3);
        this.indices.push(baseCenterIndex, baseCenterIndex + 3, baseCenterIndex + 1);

        const topCenterIndex = this.vertices.length / 3;
        this.vertices.push(0.5 + this.offsetX, 0.5, 1);
        this.normals.push(0, 0, 1);

        for (let i = 0; i < 4; i++) {
            const [x, y] = basePoints[i];
            this.vertices.push(x + this.offsetX, y, 1);
            this.normals.push(0, 0, 1);
            this.texCoords.push(x, y);
        }

        this.indices.push(topCenterIndex, topCenterIndex + 2, topCenterIndex + 1);
        this.indices.push(topCenterIndex, topCenterIndex + 4, topCenterIndex + 2);
        this.indices.push(topCenterIndex, topCenterIndex + 3, topCenterIndex + 4);
        this.indices.push(topCenterIndex, topCenterIndex + 1, topCenterIndex + 3);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
