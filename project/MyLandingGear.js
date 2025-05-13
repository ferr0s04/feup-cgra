import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCubeSize } from './MyCubeSize.js';

export class MyLandingGear extends CGFobject {
    constructor(scene) {
        super(scene);
        this.landingGearMaterial = new CGFappearance(scene);
        this.landingGearMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.landingGearMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.landingGearMaterial.setSpecular(0.2, 0.2, 0.2, 1);
        this.landingGearMaterial.setShininess(10);

        this.rightLeg = new MyCubeSize(scene, 0, 0.3, 0.25, 1, 0.5, 0.8);
        this.leftLeg = new MyCubeSize(scene, 0, 0.3, 0.25, 1, 3.7, 4);
        this.mainBase = new MyCubeSize(scene, 0, 0.3, 0, 0.25, 0, 5);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(2, -1, 0);
        this.scene.rotate(Math.PI * (3/2), 0, 1, 0);
        this.landingGearMaterial.apply();
        this.rightLeg.display();
        this.leftLeg.display();
        this.mainBase.display();
        this.scene.popMatrix();
               
    }

}