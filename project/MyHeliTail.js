import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { MyCube } from './MyCube.js';
import { MyPrism } from './MyPrism.js';
import { MyPolygon } from './MyPolygon.js';

export class MyHeliTail extends CGFobject {
    constructor(scene) {
        super(scene);

        this.tailA1 = new MyQuad(scene, [6, 4, 2.5, 14, 3.75, 2.25, 6, 4, 1.5, 14, 3.75, 1.75]);
        this.tailA2 = new MyQuad(scene, [8, 3, 2.5, 14, 3.25, 2.25, 6, 4, 2.5, 14, 3.75, 2.25]);
        this.tailA3 = new MyQuad(scene, [8, 3, 1.5, 14, 3.25, 1.75, 8, 3, 2.5, 14, 3.25, 2.25]);
        this.tailA4 = new MyQuad(scene, [14, 3.25, 1.75, 8, 3, 1.5, 14, 3.75, 1.75, 6, 4, 1.5]);

        this.tailBcenter = new MyCube(scene);
        this.tailBtop = new MyPrism(scene, 1, 0.5);
        this.tailBbottom = new MyPrism(scene, 1, 0.5);
        this.tailBlades = new MyPolygon(scene, 8);

        this.heliBasic = new CGFappearance(this.scene);
        this.heliBasic.loadTexture('textures/heli2.png');
        this.heliBasic.setDiffuse(1, 1, 1, 1);
        this.heliBasic.setSpecular(0.1, 0.1, 0.1, 1);
        this.heliBasic.setShininess(10);

        this.heliBlades = new CGFappearance(this.scene);
        this.heliBlades.loadTexture('textures/blades.png');
        this.heliBlades.setDiffuse(1, 1, 1, 1);
        this.heliBlades.setSpecular(0.1, 0.1, 0.1, 1);
        this.heliBlades.setShininess(10);
    }

    display(bladeAngle = 0) {
        // --- Draw all opaque objects first ---
        this.heliBasic.apply();
        this.tailA1.display();
        this.tailA2.display();
        this.tailA3.display();
        this.tailA4.display();
    
        this.scene.pushMatrix();
        this.scene.translate(14, 3.25, 1.75);
        this.scene.scale(0.5, 0.5, 0.5);
        this.tailBcenter.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.translate(14, 3.75, 2.25);
        this.scene.rotate(-Math.PI / 2, Math.PI / 4, 0, 0);
        this.scene.scale(0.5, 0.5, 1);    
        this.tailBtop.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.translate(14, 3.25, 1.75);
        this.scene.rotate(-Math.PI / 2, -Math.PI / 4, 0, 0);
        this.scene.scale(0.5, 0.5, 1);    
        this.tailBbottom.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.gl.depthMask(false);
        this.scene.translate(4, 5.1, 2);
        this.scene.rotate(bladeAngle, 0, 1, 0);
        this.scene.scale(7, 7, 7);
        this.heliBlades.apply();
        this.tailBlades.display();
        this.scene.gl.depthMask(true);
        this.scene.popMatrix();
    }
}
