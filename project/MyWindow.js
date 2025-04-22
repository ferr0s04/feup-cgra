import { CGFobject } from '../../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

export class MyWindow extends CGFobject {
    constructor(scene) {
        super(scene);
        this.quad = new MyQuad(this.scene);
    }

    display() {
        this.quad.display();
    }
}
