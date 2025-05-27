import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { MyCube } from './MyCube.js';

export class MyHeliBody extends CGFobject {
	constructor(scene) {
		super(scene);

		this.front1 = new MyQuad(scene, [0.5, 0.5, 1, 0.5, 0.5, 3, 0, 2, 1, 0, 2, 3]);
		this.front2 = new MyQuad(scene, [0, 2, 1, 0, 2, 3, 0.5, 3.5, 1, 0.5, 3.5, 3]);
		this.front3 = new MyQuad(scene, [2, 0, 1, 2, 0, 3, 0.5, 0.5, 1, 0.5, 0.5, 3]);
		this.front4 = new MyQuad(scene, [0.5, 3.5, 1, 0.5, 3.5, 3, 2, 4, 1, 2, 4, 3]);
		this.front5 = new MyQuad(scene, [2, 3.5, 0, 0.5, 3.5, 1, 2, 4, 1]);
		this.front6 = new MyQuad(scene, [0, 2, 1, 0.5, 3.5, 1, 2, 3.5, 0]);
        this.front7 = new MyQuad(scene, [2, 0.5, 0, 0, 2, 1, 2, 3.5, 0]);
        this.front8 = new MyQuad(scene, [2, 0.5, 0, 0.5, 0.5, 1, 0, 2, 1]);
		this.front9 = new MyQuad(scene, [2, 0, 1, 0.5, 0.5, 1, 2, 0.5, 0]);
        this.front10 = new MyQuad(scene, [0.5, 3.5, 3, 2, 3.5, 4, 2, 4, 3]);
        this.front11 = new MyQuad(scene, [0, 2, 3, 2, 3.5, 4, 0.5, 3.5, 3]);
        this.front12 = new MyQuad(scene, [2, 0.5, 4, 2, 3.5, 4, 0, 2, 3]);
        this.front13 = new MyQuad(scene, [0.5, 0.5, 3, 2, 0.5, 4, 0, 2, 3]);
        this.front14 = new MyQuad(scene, [2, 0, 3, 2, 0.5, 4, 0.5, 0.5, 3]);

        this.mid1 = new MyQuad(scene, [2, 0.5, 4, 6, 0.5, 4, 2, 3.5, 4, 6, 3.5, 4]);
        this.mid2 = new MyQuad(scene, [2, 3.5, 4, 6, 3.5, 4, 2, 4, 3, 6, 4, 3]);
        this.mid3 = new MyQuad(scene, [2, 4, 3, 6, 4, 3, 2, 4, 1, 6, 4, 1]);
        this.mid4 = new MyQuad(scene, [6, 3.5, 0, 2, 3.5, 0, 6, 4, 1, 2, 4, 1]);
        this.mid5 = new MyQuad(scene, [6, 0.5, 0, 2, 0.5, 0, 6, 3.5, 0, 2, 3.5, 0]);
        this.mid6 = new MyQuad(scene, [6, 0, 1, 2, 0, 1, 6, 0.5, 0, 2, 0.5, 0]);
        this.mid7 = new MyQuad(scene, [6, 0, 3, 2, 0, 3, 6, 0, 1, 2, 0, 1]);
        this.mid8 = new MyQuad(scene, [2, 0, 3, 6, 0, 3, 2, 0.5, 4, 6, 0.5, 4]);

        this.back1 = new MyQuad(scene, [6, 0.5, 4, 8, 1, 3, 6, 3.5, 4, 8, 3, 3]);
        this.back2 = new MyQuad(scene, [8, 1, 3, 8, 1, 1, 8, 3, 3, 8, 3, 1]);
        this.back3 = new MyQuad(scene, [8, 1, 1, 6, 0.5, 0, 8, 3, 1, 6, 3.5, 0]);
        this.back4 = new MyQuad(scene, [8, 3, 3, 8, 3, 1, 6, 4, 3, 6, 4, 1]);
        this.back5 = new MyQuad(scene, [6, 0, 3, 6, 0, 1, 8, 1, 3, 8, 1, 1]);
        this.back6 = new MyQuad(scene, [6, 3.5, 4, 8, 3, 3, 6, 4, 3]);
        this.back7 = new MyQuad(scene, [8, 3, 1, 6, 3.5, 0, 6, 4, 1]);
        this.back8 = new MyQuad(scene, [6, 0, 3, 8, 1, 3, 6, 0.5, 4]);
        this.back9 = new MyQuad(scene, [8, 1, 1, 6, 0, 1, 6, 0.5, 0]);

        this.topBase = new MyCube(scene);
        this.topSupport = new MyCube(scene);

        // Basic helicopter appearance (all red)
        this.heliBasic = new CGFappearance(this.scene);
        this.heliBasic.loadTexture('textures/heli2.png');
        this.heliBasic.setDiffuse(1, 1, 1, 1);
        this.heliBasic.setSpecular(0.1, 0.1, 0.1, 1);
        this.heliBasic.setShininess(10);

        // Helicopter windows appearance
        this.heliWindows = new CGFappearance(this.scene);
        this.heliWindows.loadTexture('textures/heli.png');
        this.heliWindows.setDiffuse(1, 1, 1, 1);
        this.heliWindows.setSpecular(0.1, 0.1, 0.1, 1);
        this.heliWindows.setShininess(10);
	}

	display() {
        this.heliWindows.apply();
        this.scene.pushMatrix();
        this.scene.translate(-4, 0, -2);
		this.front1.display();
		this.front2.display();
        this.front6.display();
        this.front7.display();
        this.front8.display();
        this.front11.display();
        this.front12.display();
        this.front13.display();

        this.heliBasic.apply();
    
		this.front3.display();
		this.front4.display();
		this.front5.display();
        this.front9.display();
        this.front10.display();
        this.front14.display();

        this.mid1.display();
        this.mid2.display();
        this.mid3.display();
        this.mid3.display();
        this.mid4.display();
        this.mid5.display();
        this.mid6.display();
        this.mid7.display();
        this.mid8.display();

        this.back1.display();
        this.back2.display();
        this.back3.display();
        this.back4.display();
        this.back5.display();
        this.back6.display();
        this.back7.display();
        this.back8.display();
        this.back9.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, 4, -0.5);
        this.scene.scale(2, 0.6, 1);
        this.topBase.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.1, 4.6, 0.1);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.2, 0.2, 0.5);
        this.topSupport.display();
        this.scene.popMatrix();
	}
}
