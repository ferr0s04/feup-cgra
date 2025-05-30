import { CGFobject } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { CGFappearance } from '../lib/CGF.js';

/**
 * MyTree
 * @constructor
 * @param scene - Reference to MyScene object
 * @param rotationDeg - Rotation angle in degrees
 * @param rotationAxis - Axis of rotation ('X' or 'Z')
 * @param trunkBaseRadius - Base radius of the trunk
 * @param treeHeight - Total height of the tree
 * @param foliageColor - Color of the foliage in RGBA format
 * @param trunkTexture - Optional texture for the trunk
 * @param foliageTexture - Optional texture for the foliage
 */
export class MyTree extends CGFobject {
    constructor(scene, rotationDeg, rotationAxis, trunkBaseRadius, treeHeight, foliageColor, trunkTexture = null, foliageTexture = null) {
        super(scene);
        this.rotationDeg = rotationDeg;
        this.rotationAxis = rotationAxis;
        this.trunkBaseRadius = trunkBaseRadius;
        this.treeHeight = treeHeight;
        this.foliageColor = foliageColor;
        this.trunkTexture = trunkTexture;
        this.foliageTexture = foliageTexture;

        this.foliageHeight = this.treeHeight * 0.4;
        this.trunkHeight = this.treeHeight * 0.9;
        this.pyramidCount = Math.max(2, Math.round(this.foliageHeight / 2.5));

        this.trunk = new MyCone(scene, 8, 5);
        this.foliage = [];

        for (let i = 0; i < this.pyramidCount; i++) {
            this.foliage.push(new MyCone(scene, 8, 1));
        }

        // Trunk appearance
        this.trunkAppearance = new CGFappearance(this.scene);
        if (this.trunkTexture) {
            this.trunkAppearance.loadTexture(this.trunkTexture);
            this.trunkAppearance.setDiffuse(1, 1, 1, 1);
            this.trunkAppearance.setTextureWrap('REPEAT', 'CLAMP_TO_EDGE');
        } else {
            this.trunkAppearance.setAmbient(0.4, 0.2, 0.05, 1.0);
            this.trunkAppearance.setDiffuse(0.4, 0.2, 0.05, 1.0);
        }

        this.trunkAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.trunkAppearance.setShininess(10);

        // Foliage appearance
        this.foliageAppearance = new CGFappearance(this.scene);
        if (this.foliageTexture) {
            this.foliageAppearance.loadTexture(this.foliageTexture);
            this.foliageAppearance.setDiffuse(1, 1, 1, 1);
            this.foliageAppearance.setTextureWrap('REPEAT', 'CLAMP_TO_EDGE');
        } else {
            this.foliageAppearance.setAmbient(...this.foliageColor, 1.0);
            this.foliageAppearance.setDiffuse(...this.foliageColor, 1.0);
        }

        this.foliageAppearance.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.foliageAppearance.setShininess(10);
    }

    display() {
        this.scene.pushMatrix();

        // Tree inclination
        if (this.rotationAxis === 'X') {
            this.scene.rotate(this.rotationDeg * Math.PI / 180, 1, 0, 0);
        } else if (this.rotationAxis === 'Z') {
            this.scene.rotate(this.rotationDeg * Math.PI / 180, 0, 0, 1);
        }

        // Trunk
        this.scene.pushMatrix();
        this.scene.scale(this.trunkBaseRadius, this.trunkHeight, this.trunkBaseRadius);
        this.trunkAppearance.apply();
        this.trunk.display();
        this.scene.popMatrix();

        // Foliage
        for (let i = 0; i < this.pyramidCount; i++) {
            this.scene.pushMatrix();
            const scaleFactor = (1.2 - i * (0.8 / this.pyramidCount)) * 5;
            const heightStep = this.treeHeight * 0.2 + i * (this.foliageHeight / this.pyramidCount) * 1.5;

            this.scene.translate(0, heightStep, 0);
            this.scene.scale(this.trunkBaseRadius * scaleFactor, this.foliageHeight / this.pyramidCount * 3, this.trunkBaseRadius * scaleFactor);
            this.foliageAppearance.apply();
            this.foliage[i].display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}
