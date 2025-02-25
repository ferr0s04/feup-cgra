import {CGFobject, CGFappearance} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangleOrange } from "./MyTriangleOrange.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleRed } from "./MyTriangleRed.js";
import { MyTriangleBlue } from "./MyTriangleBlue.js";
import { MyTrianglePink } from "./MyTrianglePink.js";
import { MyTrianglePurple } from "./MyTrianglePurple.js";

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
        this.triangleBlue = new MyTriangleBlue(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.triangleOrange = new MyTriangleOrange(this.scene);
        this.trianglePink = new MyTrianglePink(this.scene);
        this.trianglePurple = new MyTrianglePurple(this.scene);
        this.triangleRed = new MyTriangleRed(this.scene);
    }

    initMaterials() {
        this.materialGreen = new CGFappearance(this.scene);
        this.materialGreen.setDiffuse(0.0, 1.0, 0.0, 1.0);
        this.materialGreen.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materialGreen.setShininess(10.0);

        this.materialOrange = new CGFappearance(this.scene);
        this.materialOrange.setDiffuse(1.0, 0.65, 0.0, 1.0);
        this.materialOrange.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materialOrange.setShininess(10.0);

        this.materialPurple = new CGFappearance(this.scene);
        this.materialPurple.setDiffuse(0.5, 0.0, 0.5, 1.0);
        this.materialPurple.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materialPurple.setShininess(10.0);

        this.materialYellow = new CGFappearance(this.scene);
        this.materialYellow.setDiffuse(1.0, 1.0, 0.0, 1.0);
        this.materialYellow.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materialYellow.setShininess(10.0);

        this.materialPink = new CGFappearance(this.scene);
        this.materialPink.setDiffuse(1.0, 0.75, 0.8, 1.0);
        this.materialPink.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materialPink.setShininess(10.0);

        this.materialRed = new CGFappearance(this.scene);
        this.materialRed.setDiffuse(1.0, 0.0, 0.0, 1.0);
        this.materialRed.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materialRed.setShininess(10.0);

        this.materialBlue = new CGFappearance(this.scene);
        this.materialBlue.setDiffuse(0.0, 0.0, 1.0, 1.0);
        this.materialBlue.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.materialBlue.setShininess(10.0);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 3, 0);
        this.scene.rotate(-Math.PI/4, 0, 0, 1);
        this.materialOrange.apply();
        this.triangleOrange.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0);
        this.materialPink.apply();
        this.trianglePink.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-1,0);
        this.materialYellow.apply();
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.materialBlue.apply();
        this.triangleBlue.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -2, 0);
        this.materialRed.apply();
        this.triangleRed.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.translate(2.5, -0.5, 0);
        this.materialPurple.apply();
        this.trianglePurple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(3, 5, 0);
        this.scene.rotate(Math.PI/6, 0, 0, 1);
        this.scene.customMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();
    }
}
