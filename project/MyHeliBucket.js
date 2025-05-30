import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
import { MyCone } from './MyCone.js';
import { MyPolygon } from './MyPolygon.js';
import { MyWaterParticle } from './MyWaterParticle.js';
import { MyCube } from './MyCube.js';

export class MyHeliBucket extends CGFobject {
    constructor(scene) {
        super(scene);

        this.bucket = new MySphere(scene, 1, 20, 20, false, 0.7); // Sphere to represent the bucket (only 70% visible)
        this.cables = new MyCone(scene, 20, 20); // Cone to represent the bucket cables
        this.water = new MyPolygon(scene, 20);
        this.particleCube = new MyCube(scene);
        this.extinguishRange = 15; // Range putting out fires
        this.waterEffect = 8;  // How many units the water particles spread

        // Bucket appearance
        this.bucketAppearance = new CGFappearance(scene);
        this.bucketAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.bucketAppearance.setDiffuse(0.9, 0.3, 0.1, 1);
        this.bucketAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.bucketAppearance.setShininess(10);

        // Water texture appearance (when filled)
        this.waterTexture = new CGFappearance(this.scene);
        this.waterTexture.loadTexture("textures/waterTex.jpg");
        this.waterTexture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.waterTexture.setSpecular(0.1, 0.1, 0.1, 1);
        this.waterTexture.setShininess(10);
        this.waterTexture.setTextureWrap("REPEAT", "REPEAT");

        // Cable appearance
        this.cableAppearance = new CGFappearance(scene);
        this.cableAppearance.setAmbient(0.1, 0.1, 0.1, 1);
        this.cableAppearance.setDiffuse(0.9, 0.9, 0.9, 0.5);
        this.cableAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.cableAppearance.setShininess(10);
        this.cableAppearance.loadTexture('textures/cables.png');
        this.cableAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.scene.gl.disable(this.scene.gl.CULL_FACE);

        this.particles = [];
        this.isDropping = false;
        this.dropStartTime = 0;
        this.dropDuration = 5000;
        this.lastUpdateTime = 0;

        // Appearance for the water particles
        this.particleAppearance = new CGFappearance(scene);
        this.particleAppearance.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.particleAppearance.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.particleAppearance.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.particleAppearance.setShininess(10);
    }

    startDropping(currentTime) {
        this.isDropping = true;
        this.dropStartTime = currentTime;
        this.particles = [];
    }

    update(t) {
        if (this.lastUpdateTime === 0) {
            this.lastUpdateTime = t;
            return;
        }

        const deltaTime = (t - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = t;

        // Update existing particles
        this.particles = this.particles.filter(p => p.active);
        this.particles.forEach(p => p.update(deltaTime));

        // Generate new particles if dropping
        if (this.isDropping) {
            if (t - this.dropStartTime > this.dropDuration) {
                this.isDropping = false;
                if (this.scene.forest) {
                    this.scene.forest.checkFireExtinguish(
                        this.scene.heli.x - this.scene.forest.forestX, 
                        this.scene.heli.z - this.scene.forest.forestZ,
                        this.extinguishRange
                    );
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    const spread = this.waterEffect;
                    const particle = new MyWaterParticle(
                        (Math.random() - 0.5) * spread,
                        -6.5,
                        (Math.random() - 0.5) * spread,
                        (Math.random() - 0.5) * 4,
                        -2,
                        (Math.random() - 0.5) * 4
                    );
                    this.particles.push(particle);
                }
            }
        }
    }

    display() {
        // Bucket
        this.scene.pushMatrix();
        this.scene.translate(0, -6.5, 0);
        this.scene.scale(1, 1.5, 1);
        this.bucketAppearance.apply();
        this.bucket.display();
        this.scene.popMatrix();

        // Water inside the bucket
        if (!this.scene.heli.bucketEmpty) {
            this.scene.pushMatrix();
            this.scene.translate(0, -6.0, 0);
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.scene.scale(0.8, 0.5, 0.8);
            this.waterTexture.apply();
            this.water.display();
            this.scene.popMatrix();
        }

        // Cables
        this.scene.pushMatrix();
        this.scene.translate(0, -6.5, 0);
        this.scene.scale(1, 7, 1);
        this.cableAppearance.apply();
        this.cables.display();
        this.scene.popMatrix();

        // Water particles
        this.particleAppearance.apply();
        for (const particle of this.particles) {
            this.scene.pushMatrix();
            this.scene.translate(particle.x, particle.y, particle.z);
            this.scene.scale(0.1, 0.1, 0.1);
            this.particleCube.display();
            this.scene.popMatrix();
        }
    }
}
