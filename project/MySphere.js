import { CGFobject } from '../../lib/CGF.js';

export class MySphere extends CGFobject {

    constructor(scene, radius, slices, stacks, inside = false) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.inside = inside ? -1 : 1;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Vertices, normals and texture coordinates
        for (let stack = 0; stack <= this.stacks; stack++) {
            let theta = Math.PI * stack / this.stacks; // angle from the top
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let slice = 0; slice <= this.slices; slice++) {
                let phi = 2 * Math.PI * slice / this.slices; // Angle for each slice
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = this.radius * cosPhi * sinTheta;
                let y = this.radius * cosTheta;
                let z = this.radius * sinPhi * sinTheta;

                this.vertices.push(x, y, z);
                this.normals.push(this.inside * (x / this.radius), this.inside * (y / this.radius), this.inside * (z / this.radius));
                this.texCoords.push(1 - slice / this.slices, stack / this.stacks);
            }
        }

        // Indices
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                let current = stack * (this.slices + 1) + slice;
                let next = current + this.slices + 1;

                // Inverting the index order to change the face direction if inside is true
                if (this.inside === 1) {
                    this.indices.push(current, next + 1, next, current, current + 1, next + 1);
                } else {
                    this.indices.push(current, next, next + 1, current, next + 1, current + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
