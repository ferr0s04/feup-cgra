import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';

/**
 * MyPanorama
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPanorama extends CGFobject {

    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.sphere = new MySphere(this.scene, 200, 50, 50, true); // inside = true

        this.panoramaTexture = new CGFappearance(this.scene);
        this.panoramaTexture.setAmbient(0.1, 0.1, 0.1, 1);
        this.panoramaTexture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.panoramaTexture.setSpecular(0.1, 0.1, 0.1, 1);
        this.panoramaTexture.setShininess(10);

        this.panoramaTexture.loadTexture("textures/landscape2.jpg");

        
        this.panoramaTexture.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.scene.pushMatrix();

        // Mover a esfera para a posição atual da câmara
        const camPos = this.scene.camera.position;
        this.scene.translate(camPos[0], camPos[1], camPos[2]);

        this.panoramaTexture.apply();
        this.sphere.display();

        this.scene.popMatrix();
    }
}
