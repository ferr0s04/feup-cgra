import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCubeSize } from './MyCubeSize.js';
import { MyLandingGear }  from './MyLandingGear.js';

export class MyFullLandingGear extends CGFobject {
    constructor(scene) {
        super(scene);
        this.landingGearL = new MyLandingGear(this.scene);
        this.landingGearR = new MyLandingGear(this.scene);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-1.05, 0, 0);
        this.landingGearR.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.95, 0, 0);
        this.landingGearL.display();
        this.scene.popMatrix();      
    }

}