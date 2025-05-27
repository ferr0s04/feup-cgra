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
        this.scene.translate(0,0.2, 0.8);
        this.landingGearR.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.2, -1);
        this.landingGearL.display();
        this.scene.popMatrix();      
    }
}