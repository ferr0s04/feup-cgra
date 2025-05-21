import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
import { MyCone } from './MyCone.js';
import { MyPolygon } from './MyPolygon.js';
import { MyWaterParticle } from './MyWaterParticle.js';
import { MyCube } from './MyCube.js';

export class MyHeliBucket extends CGFobject {
    constructor(scene) {
        super(scene);

        this.bucket = new MySphere(scene, 1, 20, 20, false, 0.7); // raio 1, fora visível
        this.cables = new MyCone(scene, 20, 20); // cone com muitos segmentos para suavidade
        this.water = new MyPolygon(scene, 20);
        this.particleCube = new MyCube(scene);
        this.extinguishRange = 20; // Range for putting out fires
        this.waterEffect = 8;  // How many units the water particles spread

        // Aparência do balde
        this.bucketAppearance = new CGFappearance(scene);
        this.bucketAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.bucketAppearance.setDiffuse(0.9, 0.3, 0.1, 1);
        this.bucketAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.bucketAppearance.setShininess(10);

        this.waterTexture = new CGFappearance(this.scene);
        this.waterTexture.loadTexture("textures/waterTex.jpg");
        this.waterTexture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.waterTexture.setSpecular(0.1, 0.1, 0.1, 1);
        this.waterTexture.setShininess(10);
        this.waterTexture.setTextureWrap("REPEAT", "REPEAT");

        // Aparência dos cabos (transparente)
        this.cableAppearance = new CGFappearance(scene);
        this.cableAppearance.setAmbient(0.1, 0.1, 0.1, 1);
        this.cableAppearance.setDiffuse(0.9, 0.9, 0.9, 0.5);
        this.cableAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.cableAppearance.setShininess(10);
        this.cableAppearance.loadTexture('textures/cables.png'); // textura com transparência (apenas os fios)
        this.cableAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.scene.gl.disable(this.scene.gl.CULL_FACE);

        this.particles = [];
        this.isDropping = false;
        this.dropStartTime = 0;
        this.dropDuration = 5000;
        this.lastUpdateTime = 0;

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
                // Check for fire extinguishing when water finishes dropping
                if (this.scene.forest) {
                    this.scene.forest.checkFireExtinguish(
                        this.scene.heli.x - this.scene.forest.forestX, 
                        this.scene.heli.z - this.scene.forest.forestZ,
                        this.extinguishRange
                    );
                }
            } else {
                // Add new particles with wider spread
                for (let i = 0; i < 5; i++) {
                    const spread = this.waterEffect;
                    const particle = new MyWaterParticle(
                        0 + (Math.random() - 0.5) * spread,  // wider x spread
                        -6.5,
                        0 + (Math.random() - 0.5) * spread,  // wider z spread
                        (Math.random() - 0.5) * 4,        // faster x velocity
                        -2,                               // faster downward velocity
                        (Math.random() - 0.5) * 4         // faster z velocity
                    );
                    this.particles.push(particle);
                }
            }
        }
    }

    display() {
        // Exibir o balde
        this.scene.pushMatrix();
        this.scene.translate(0, -6.5, 0);
        this.scene.scale(1, 1.5, 1);
        this.bucketAppearance.apply();
        this.bucket.display();
        this.scene.popMatrix();

        // Exibir a água dentro do balde
        this.scene.pushMatrix();
        this.scene.translate(0, -6.0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(0.8, 0.5, 0.8);
        this.waterTexture.apply();
        this.water.display();
        this.scene.popMatrix();

        // Exibir o cone invertido (cabos)
        this.scene.pushMatrix();
        this.scene.translate(0, -6.5, 0);  // Levanta o cone acima do balde
        this.scene.scale(1, 7, 1);  // Esticar para parecer cabos longos
        this.cableAppearance.apply();
        this.cables.display();
        this.scene.popMatrix();

        // Exibir a água a cair do balde
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
