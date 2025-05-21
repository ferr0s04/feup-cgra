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
    }

    initQuads() {
        // Create triangles using MyQuad with 3 vertices each
        this.centerTriangle = new MyQuad(this.scene, [
            -0.5*this.size, 0.0, 0.0,    
            0.5*this.size, 0.0, 0.0,     
            0.0, 2.0*this.size, 0.0
        ]);

        this.leftTriangle = new MyQuad(this.scene, [
            -0.8*this.size, 0.0, 0.2*this.size,
            -0.3*this.size, 0.0, 0.2*this.size,
            -0.5*this.size, 1.5*this.size, 0.0
        ]);

        this.rightTriangle = new MyQuad(this.scene, [
            0.3*this.size, 0.0, 0.2*this.size,
            0.8*this.size, 0.0, 0.2*this.size,
            0.5*this.size, 1.5*this.size, 0.0
        ]);
    }

    initMaterials() {
        // Create appearance for the center triangle (brighter orange)
        this.appearance2 = new CGFappearance(this.scene);
        this.appearance2.setAmbient(1.0, 0.6, 0.2, 1.0);
        this.appearance2.setDiffuse(1.0, 0.6, 0.2, 1.0);
        this.appearance2.setSpecular(1.0, 0.6, 0.2, 1.0);
        this.appearance2.setShininess(10);
        this.appearance2.setEmission(0.5, 0.3, 0.1, 1.0);

        // Create appearance for the side triangles (darker orange)
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

        // --- Update fire particles ---
        const deltaTime = elapsed / 1000;
        // Remove inactive particles
        this.particles = this.particles.filter(p => p.active);
        this.particles.forEach(p => p.update(deltaTime));

        // Spawn new particles every 60ms (about 16 per second)
        if (t - this.lastParticleTime > 100) {
            this.lastParticleTime = t;
            for (let i = 0; i < 2; i++) { // spawn 2 at a time for denser effect
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
                        px - this.x, // local to fire
                        py,
                        pz - this.z,
                        velX, velY, velZ
                    )
                );
            }
        }
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