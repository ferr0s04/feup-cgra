import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCube } from './MyCube.js';
import { MyQuad } from './MyQuad.js';
import { MyWindow } from './MyWindow.js';

export class MyBuilding extends CGFobject {
    constructor(scene, totalWidth, numFloors, windowsPerFloor, windowTexture, buildingColor) {
        super(scene);
        this.totalWidth = totalWidth;
        this.numFloors = numFloors;
        this.windowsPerFloor = windowsPerFloor;
        this.windowTexture = windowTexture;
        this.buildingColor = buildingColor;

        this.initElements();
    }

    initElements() {
        this.floorHeight = 2.5;
        this.depth = this.totalWidth / 3;

        this.centralWidth = this.depth;
        this.lateralWidth = 0.75 * this.centralWidth;

        this.centralFloors = this.numFloors + 1;

        this.wallAppearance = new CGFappearance(this.scene);
        this.wallAppearance.setTexture(null);
        let [r, g, b] = this.buildingColor;
        this.wallAppearance.setAmbient(r, g, b, 1);
        this.wallAppearance.setDiffuse(r, g, b, 1);
        this.wallAppearance.setSpecular(0.4, 0.4, 0.4, 1);
        this.wallAppearance.setShininess(40);

        this.doorAppearance = new CGFappearance(this.scene);
        this.doorAppearance.loadTexture('textures/door.jpg');
        this.doorAppearance.setDiffuse(1, 1, 1, 1);
        this.doorAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.doorAppearance.setShininess(10);

        this.windowAppearance = new CGFappearance(this.scene);
        this.windowAppearance.loadTexture('textures/window1.jpg');
        this.windowAppearance.setDiffuse(1, 1, 1, 1);
        this.windowAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.windowAppearance.setShininess(10);

        this.heliportAppearance = new CGFappearance(this.scene);
        this.heliportAppearance.loadTexture('textures/heliporto.png');
        this.heliportAppearance.setDiffuse(1, 1, 1, 1);
        this.heliportAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.heliportAppearance.setShininess(10);

        this.signAppearance = new CGFappearance(this.scene);
        this.signAppearance.loadTexture('textures/bombeiros.jpg');
        this.signAppearance.setDiffuse(1, 1, 1, 1);
        this.signAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.signAppearance.setShininess(10);

        this.doorQuad = new MyQuad(this.scene);
        this.heliportQuad = new MyQuad(this.scene);
        this.signQuad = new MyQuad(this.scene);

        const h = this.floorHeight;

        this.leftModule = new MyCube(this.scene);
        this.centralModule = new MyCube(this.scene);
        this.rightModule = new MyCube(this.scene);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.lateralWidth, 0, 0);
        this.scene.scale(this.lateralWidth, this.floorHeight * (this.centralFloors - 1), this.depth * 0.8);
        this.wallAppearance.apply();
        this.leftModule.display();
        //console.log(this.wallAppearance);
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.scale(this.centralWidth, this.floorHeight * this.centralFloors, this.depth);
        this.wallAppearance.apply();
        this.centralModule.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.centralWidth, 0, 0);
        this.scene.scale(this.lateralWidth, this.floorHeight * (this.centralFloors - 1), this.depth * 0.8);
        this.wallAppearance.apply();
        this.rightModule.display();
        this.scene.popMatrix();

        // Door
        let h = this.floorHeight;
        let doorHeight = 0.7 * (h);
        let doorWidth = 0.75 * doorHeight;
        let cx = 0;
        let cz = this.depth;
        let cy = 0;

        let centerX = cx + (this.centralWidth - doorWidth) / 2;
        let doorY = cy;

        this.scene.pushMatrix();
        this.scene.translate(centerX + doorWidth / 2, doorY + doorHeight / 2, cz + 0.01);
        this.scene.scale(doorWidth, doorHeight, 1);
        this.doorAppearance.apply();
        this.doorQuad.display();
        this.scene.popMatrix();

        // Heliport
        this.heliportAppearance.apply();

        this.scene.pushMatrix();
        this.scene.translate(this.centralWidth / 2, this.centralFloors * this.floorHeight + 0.01, this.depth / 2); // Centered on top face
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.centralWidth, this.depth, 1);

        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);

        this.heliportAppearance.apply();
        this.heliportQuad.display();
        this.scene.popMatrix();

        // Bombeiros sign
        this.scene.pushMatrix();

        let signWidth = doorWidth * 2;
        let signHeight = doorHeight * 0.4;
        let signX = centerX + doorWidth / 2;
        let signY = doorY + doorHeight + signHeight / 1.5;
        let signZ = cz + 0.02;

        this.scene.translate(signX, signY, signZ);
        this.scene.scale(signWidth, signHeight, 1);
        this.signAppearance.apply();
        this.signQuad.display();

        this.scene.popMatrix();

        // Windows
        if (!this.myWindow) this.myWindow = new MyWindow(this.scene);

        const drawWindows = (startX, moduleWidth, floors, depth, central = false) => {
            const windowHeight = 1.25;
            const windowWidth = 1.25;
            const spacingY = (h - windowHeight) / 2;
            const startFloor = central ? 1 : 0;
        
            let numWindows = this.windowsPerFloor;
            let b = (moduleWidth - numWindows * windowWidth) / (numWindows + 1);
        
            // Fallback attempts
            if (b <= 0) {
                numWindows = 2;
                b = (moduleWidth - numWindows * windowWidth) / (numWindows + 1);
            }
            if (b <= 0) {
                numWindows = 1;
                b = (moduleWidth - numWindows * windowWidth) / (numWindows + 1);
            }
            if (b <= 0) return; // Abort drawing if no space
        
            for (let floor = startFloor; floor < floors; floor++) {
                let baseY = h * floor + spacingY;
        
                for (let col = 0; col < numWindows; col++) {
                    let x = startX + b * (col + 1) + windowWidth * col;
                    let y = baseY;
                    let z = depth + 0.01;
        
                    this.scene.pushMatrix();
                    this.scene.translate(x + windowWidth / 2, y + windowHeight / 2, z);
                    this.scene.scale(windowWidth, windowHeight, 1);
                    this.scene.translate(0, 0, 0.01);
                    this.windowTexture.apply ? this.windowTexture.apply() : this.windowAppearance.apply();
                    this.myWindow.display();
                    this.scene.popMatrix();
                }
            }
        };
        
        // Left module windows
        drawWindows(this.centralWidth, this.lateralWidth, this.numFloors, this.depth * 0.8);

        // Central module windows
        drawWindows(0, this.centralWidth, this.centralFloors, this.depth, true);

        // Right module windows
        drawWindows(-this.lateralWidth, this.lateralWidth, this.numFloors, this.depth * 0.8);
    }
}
