import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
import { MyCone } from './MyCone.js';

export class MyHeliBucket extends CGFobject {
    constructor(scene) {
        super(scene);

        this.bucket = new MySphere(scene, 1, 20, 20, false); // raio 1, fora visível
        this.cables = new MyCone(scene, 20, 20); // cone com muitos segmentos para suavidade

        // Aparência do balde
        this.bucketAppearance = new CGFappearance(scene);
        this.bucketAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.bucketAppearance.setDiffuse(0.9, 0.3, 0.1, 1);
        this.bucketAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.bucketAppearance.setShininess(10);

        // Aparência dos cabos (transparente)
        this.cableAppearance = new CGFappearance(scene);
        this.cableAppearance.setAmbient(0.1, 0.1, 0.1, 1);
        this.cableAppearance.setDiffuse(0.9, 0.9, 0.9, 0.5);
        this.cableAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.cableAppearance.setShininess(10);
        this.cableAppearance.loadTexture('textures/cables.png'); // textura com transparência (apenas os fios)
        this.cableAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
    }

    display() {
        // Exibir o cone invertido (cabos)
        this.scene.pushMatrix();
        this.scene.translate(0, -6.5, 0);  // Levanta o cone acima do balde
        this.scene.scale(1, 7, 1);  // Esticar para parecer cabos longos
        this.cableAppearance.apply();
        this.cables.display();
        this.scene.popMatrix();

        // Exibir o balde (meia esfera)
        this.scene.pushMatrix();
        this.scene.translate(0, -6.5, 0);
        this.scene.scale(1, 1.5, 1); // Meia esfera: achatado no Y
        this.bucketAppearance.apply();
        this.bucket.display();
        this.scene.popMatrix();
    }
}
