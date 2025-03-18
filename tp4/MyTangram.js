import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangleOrange } from './MyTriangleOrange.js';
import { MyTriangleBlue } from './MyTriangleBlue.js';
import { MyTrianglePink } from './MyTrianglePink.js';
import { MyTrianglePurple } from './MyTrianglePurple.js';
import { MyParallelogram } from './MyParallelogram.js';
import { MyTriangleRed } from './MyTriangleRed.js';

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initComponents();
        this.initMaterials();
    }

    initComponents() {
        this.diamond = new MyDiamond(this.scene);
        this.triangleOrange = new MyTriangleOrange(this.scene);
        this.triangleBlue = new MyTriangleBlue(this.scene);
        this.trianglePink = new MyTrianglePink(this.scene);
        this.trianglePurple = new MyTrianglePurple(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.triangleRed = new MyTriangleRed(this.scene);
    }

    initMaterials() {
        this.texture = new CGFtexture(this.scene, 'images/tangram.png');

        this.materialTangram = new CGFappearance(this.scene);
        this.materialTangram.setAmbient(0.1, 0.1, 0.1, 1);
        this.materialTangram.setDiffuse(0.9, 0.9, 0.9, 1);
        this.materialTangram.setSpecular(0.1, 0.1, 0.1, 1);
        this.materialTangram.setShininess(10);
        
        this.materialTangram.setTexture(this.texture);
        this.materialTangram.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.materialTangram.apply();
        this.scene.pushMatrix();
        this.scene.translate(3, 5, 0);
        this.scene.rotate(Math.PI/6, 0, 0, 1);
        this.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 3, 0);
        this.scene.rotate(-Math.PI/4, 0, 0, 1);
        this.triangleOrange.display();
        this.scene.popMatrix();

        this.triangleBlue.display();

        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0);
        this.trianglePink.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.translate(2.5, -0.5, 0);
        this.trianglePurple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-1,0);
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -2, 0); 
        this.triangleRed.display();
        this.scene.popMatrix();
    }
}
