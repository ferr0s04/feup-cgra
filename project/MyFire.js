import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyFire extends CGFobject {
    constructor(scene, x, z, size = 1.0) {
        super(scene);
        this.x = x;
        this.z = z;
        this.size = size;
        this.initBuffers();
        this.initMaterials();
        this.angleOffset = Math.random() * Math.PI * 2; // Random initial angle
        this.lastTime = 0;
    }

    initBuffers() {
        // Center triangle vertices
        this.vertices = [
            // Center triangle
            -0.5*this.size, 0.0, 0.0,    // 0
            0.5*this.size, 0.0, 0.0,     // 1
            0.0, 2.0*this.size, 0.0,     // 2

            // Left triangle
            -0.8*this.size, 0.0, 0.2*this.size,    // 3
            -0.3*this.size, 0.0, 0.2*this.size,    // 4
            -0.5*this.size, 1.5*this.size, 0.0,    // 5

            // Right triangle
            0.3*this.size, 0.0, 0.2*this.size,     // 6
            0.8*this.size, 0.0, 0.2*this.size,     // 7
            0.5*this.size, 1.5*this.size, 0.0      // 8
        ];

        this.indices = [
            0, 1, 2,    // Center triangle
            3, 4, 5,    // Left triangle
            6, 7, 8,   // Right triangle
            2, 1, 0,
            5, 4, 3,
            8, 7, 6
        ];

        this.colors = [
            // Center triangle (lighter orange)
            1.0, 0.6, 0.2, 1.0,    // Vertex 0
            1.0, 0.6, 0.2, 1.0,    // Vertex 1
            1.0, 0.6, 0.2, 1.0,    // Vertex 2

            // Left triangle (darker orange)
            0.9, 0.3, 0.0, 1.0,    // Vertex 3
            0.9, 0.3, 0.0, 1.0,    // Vertex 4
            0.9, 0.3, 0.0, 1.0,    // Vertex 5

            // Right triangle (darker orange)
            0.9, 0.3, 0.0, 1.0,    // Vertex 6
            0.9, 0.3, 0.0, 1.0,    // Vertex 7
            0.9, 0.3, 0.0, 1.0     // Vertex 8
        ];

        // Add back-facing colors (same pattern)
        this.colors.push(...this.colors);

        this.normals = [
            0, 0, 1,    // Center triangle
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,    // Left triangle
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,    // Right triangle
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    initMaterials() {
        this.appearance1 = new CGFappearance(this.scene);
        this.appearance1.setAmbient(0.8, 0.2, 0.0, 1.0);
        this.appearance1.setDiffuse(0.9, 0.3, 0.0, 1.0);
        this.appearance1.setSpecular(1.0, 0.4, 0.0, 1.0);
        this.appearance1.setShininess(10);

        this.appearance2 = new CGFappearance(this.scene);
        this.appearance2.setAmbient(0.8, 0.2, 0.0, 1.0);
        this.appearance2.setDiffuse(1.9, 0.6, 0.2, 1.0);
        this.appearance2.setSpecular(1.0, 0.4, 0.0, 1.0);
        this.appearance2.setShininess(10);
    }

    update(t) {
        if (this.lastTime == 0) {
            this.lastTime = t;
            return;
        }

        const elapsed = t - this.lastTime;
        this.angleOffset += (elapsed/10000.0) * Math.PI; // Rotate over time
        this.lastTime = t;
    }

    display() {
        this.scene.pushMatrix();
        
        // Position the fire
        this.scene.translate(this.x, 0.1, this.z);
        this.scene.rotate(this.angleOffset, 0, 1, 0);

        // Draw center triangle with appearance2
        this.appearance2.apply();
        this.scene.pushMatrix();
        this.scene.gl.drawElements(this.primitiveType, 3, this.scene.gl.UNSIGNED_SHORT, 0);
        this.scene.gl.drawElements(this.primitiveType, 3, this.scene.gl.UNSIGNED_SHORT, 9 * 2); // Back face
        this.scene.popMatrix();

        // Draw side triangles with appearance1
        this.appearance1.apply();
        this.scene.pushMatrix();
        this.scene.gl.drawElements(this.primitiveType, 6, this.scene.gl.UNSIGNED_SHORT, 3 * 2);
        this.scene.gl.drawElements(this.primitiveType, 6, this.scene.gl.UNSIGNED_SHORT, 12 * 2); // Back face
        this.scene.popMatrix();
        
        this.scene.popMatrix();
    }
}