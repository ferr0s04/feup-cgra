import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { MyFireParticle } from './MyFireParticle.js';
import { MyCube } from './MyCube.js';

export class MyFire extends CGFobject {
    constructor(scene, x, z, size = 1.0) {
        super(scene);
        this.x = x;
        this.z = z;
        this.size = size;
        this.initQuads();
        this.initMaterials();
        this.angleOffset = Math.random() * Math.PI * 2;
        this.lastTime = 0;

        // Fire particles
        this.particles = [];
        this.particleCube = new MyCube(scene);
        this.particleAppearance = new CGFappearance(scene);
        this.particleAppearance.setAmbient(1.0, 0.7, 0.2, 1.0);
        this.particleAppearance.setDiffuse(1.0, 0.7, 0.2, 1.0);
        this.particleAppearance.setSpecular(1.0, 0.7, 0.2, 1.0);
        this.particleAppearance.setShininess(10);
        this.lastParticleTime = 0;

        this.flameOffsets = [
            Math.random() * 1000,
            Math.random() * 1000,
            Math.random() * 1000
    ];
    }

    initQuads() {
        // Randomize the scale of the triangles
        this.centerScale = {
            width: 0.9 + Math.random() * 0.3,
            height: 0.9 + Math.random() * 0.3
        };
        this.leftScale = {
            width: 0.9 + Math.random() * 0.3,
            height: 0.9 + Math.random() * 0.3
        };
        this.rightScale = {
            width: 0.9 + Math.random() * 0.3,
            height: 0.9 + Math.random() * 0.3
        };

        // Vertices for the triangles
        this.centerVerts = [
            -0.5*this.size*this.centerScale.width, 0.0, 0.0,    
            0.5*this.size*this.centerScale.width, 0.0, 0.0,     
            0.0, 2.0*this.size*this.centerScale.height, 0.0
        ];
        this.leftVerts = [
            -0.8*this.size*this.leftScale.width, 0.0, 0.2*this.size,
            -0.3*this.size*this.leftScale.width, 0.0, 0.2*this.size,
            -0.5*this.size*this.leftScale.width, 1.5*this.size*this.leftScale.height, 0.0
        ];
        this.rightVerts = [
            0.3*this.size*this.rightScale.width, 0.0, 0.2*this.size,
            0.8*this.size*this.rightScale.width, 0.0, 0.2*this.size,
            0.5*this.size*this.rightScale.width, 1.5*this.size*this.rightScale.height, 0.0
        ];

        // Triangles
        this.centerTriangle = new MyQuad(this.scene, [...this.centerVerts]);
        this.leftTriangle = new MyQuad(this.scene, [...this.leftVerts]);
        this.rightTriangle = new MyQuad(this.scene, [...this.rightVerts]);
    }

    initMaterials() {
        // Appearance for the center triangle (brighter orange)
        this.appearance2 = new CGFappearance(this.scene);
        this.appearance2.setAmbient(1.0, 0.6, 0.2, 1.0);
        this.appearance2.setDiffuse(1.0, 0.6, 0.2, 1.0);
        this.appearance2.setSpecular(1.0, 0.6, 0.2, 1.0);
        this.appearance2.setShininess(10);
        this.appearance2.setEmission(0.5, 0.3, 0.1, 1.0);

        // Appearance for the side triangles (darker orange)
        this.appearance1 = new CGFappearance(this.scene);
        this.appearance1.setAmbient(0.9, 0.3, 0.0, 1.0);
        this.appearance1.setDiffuse(0.9, 0.3, 0.0, 1.0);
        this.appearance1.setSpecular(0.9, 0.3, 0.0, 1.0);
        this.appearance1.setShininess(10);
        this.appearance1.setEmission(0.3, 0.1, 0.0, 1.0);
    }

    update(t) {
        if (this.lastTime == 0) {
            this.lastTime = t;
            this.lastParticleTime = t;
            return;
        }

        const elapsed = t - this.lastTime;
        this.angleOffset += (elapsed/50000.0) * Math.PI;
        this.lastTime = t;

        // Update fire particles
        const deltaTime = elapsed / 1000;
        this.particles = this.particles.filter(p => p.active);
        this.particles.forEach(p => p.update(deltaTime));

        // Spawn new particles every 100ms
        if (t - this.lastParticleTime > 100) {
            this.lastParticleTime = t;
            for (let i = 0; i < 2; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const radius = Math.random() * this.size * 0.3;
                const px = this.x + Math.cos(angle) * radius;
                const pz = this.z + Math.sin(angle) * radius;
                const py = 0.1 + Math.random() * 0.5 * this.size;
                const velY = 1.5 + Math.random() * 1.5;
                const velX = (Math.random() - 0.5) * 0.5;
                const velZ = (Math.random() - 0.5) * 0.5;
                this.particles.push(
                    new MyFireParticle(
                        px - this.x,
                        py,
                        pz - this.z,
                        velX, velY, velZ
                    )
                );
            }
        }

        const time = t / 400;

        // Dynamic scaling for the triangles
        const centerScaleW = this.centerScale.width * (0.95 + 0.1 * Math.sin(time + this.flameOffsets[0]));
        const centerScaleH = this.centerScale.height * (0.95 + 0.1 * Math.cos(time + this.flameOffsets[0]));
        const leftScaleW   = this.leftScale.width   * (0.95 + 0.1 * Math.sin(time + this.flameOffsets[1]));
        const leftScaleH   = this.leftScale.height  * (0.95 + 0.1 * Math.cos(time + this.flameOffsets[1]));
        const rightScaleW  = this.rightScale.width  * (0.95 + 0.1 * Math.sin(time + this.flameOffsets[2]));
        const rightScaleH  = this.rightScale.height * (0.95 + 0.1 * Math.cos(time + this.flameOffsets[2]));

        // Center
        let centerOsc = this.centerVerts.map((v, i) => {
            if (i === 0) // x of 1st vertex
                return v * centerScaleW + 0.08 * Math.sin(time + this.flameOffsets[0] + i);
            if (i === 3) // x of 2nd vertex
                return v * centerScaleW + 0.08 * Math.sin(time + this.flameOffsets[0] + i);
            if (i === 6) // x of 3rd vertex (top)
                return v * 1 + 0.08 * Math.sin(time + this.flameOffsets[0] + i);
            if (i === 7) // y of 3rd vertex (top)
                return v * centerScaleH;
            if (i % 3 === 2) // z
                return v + 0.08 * Math.cos(time + this.flameOffsets[0] + i);
            return v;
        });
        this.centerTriangle.customVertices = centerOsc;
        this.centerTriangle.initBuffers();

        // Left
        let leftOsc = this.leftVerts.map((v, i) => {
            if (i === 0 || i === 3) // x of 2 first vertices
                return v * leftScaleW + 0.08 * Math.sin(time + this.flameOffsets[1] + i);
            if (i === 6) // top x
                return v * 1 + 0.08 * Math.sin(time + this.flameOffsets[1] + i);
            if (i === 7) // top y
                return v * leftScaleH;
            if (i % 3 === 2)
                return v + 0.08 * Math.cos(time + this.flameOffsets[1] + i);
            return v;
        });
        this.leftTriangle.customVertices = leftOsc;
        this.leftTriangle.initBuffers();

        // Right
        let rightOsc = this.rightVerts.map((v, i) => {
            if (i === 0 || i === 3)
                return v * rightScaleW + 0.08 * Math.sin(time + this.flameOffsets[2] + i);
            if (i === 6)
                return v * 1 + 0.08 * Math.sin(time + this.flameOffsets[2] + i);
            if (i === 7)
                return v * rightScaleH;
            if (i % 3 === 2)
                return v + 0.08 * Math.cos(time + this.flameOffsets[2] + i);
            return v;
        });
        this.rightTriangle.customVertices = rightOsc;
        this.rightTriangle.initBuffers();
    }

    display() {
        this.scene.pushMatrix();
        
        // Position the fire
        this.scene.translate(this.x, 0.1, this.z);
        this.scene.rotate(this.angleOffset, 0, 1, 0);

        // Draw center triangle with brighter orange
        this.appearance2.apply();
        this.centerTriangle.display();

        // Draw side triangles with darker orange
        this.appearance1.apply();
        this.leftTriangle.display();
        this.rightTriangle.display();

        // Draw back faces
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.appearance2.apply();
        this.centerTriangle.display();
        this.appearance1.apply();
        this.leftTriangle.display();
        this.rightTriangle.display();

        this.particleAppearance.apply();
        for (const particle of this.particles) {
            this.scene.pushMatrix();
            this.scene.translate(particle.x, particle.y, particle.z);
            this.scene.scale(0.12 * this.size, 0.12 * this.size, 0.12 * this.size);
            this.particleCube.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}