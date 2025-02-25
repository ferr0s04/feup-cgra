import {CGFobject} from '../lib/CGF.js';
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
    }
    initComponents() {
        //Initialize scene objects
        this.diamond = new MyDiamond(this.scene);
        this.triangleBlue = new MyTriangleBlue(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.triangleOrange = new MyTriangleOrange(this.scene);
        this.trianglePink = new MyTrianglePink(this.scene);
        this.trianglePurple = new MyTrianglePurple(this.scene);
        this.triangleRed = new MyTriangleRed(this.scene);
    }
    display() {
        let green = [0.0, 1.0, 0.0, 1.0];
        let orange = [1.0, 0.65, 0.0, 1.0];
        let purple = [0.5, 0.0, 0.5, 1.0];
        let yellow = [1.0, 1.0, 0.0, 1.0];
        let pink = [1.0, 0.75, 0.8, 1.0];
        let red = [1.0, 0.0, 0.0, 1.0];


        this.triangleBlue.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 3, 0); // 3 para cima
        this.scene.setDiffuse(...orange);
        this.scene.rotate(-Math.PI/4, 0, 0, 1); // rodar 90º
        this.triangleOrange.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0); // 1 para direita
        this.scene.setDiffuse(...pink);
        this.trianglePink.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-1,0); 
        this.scene.setDiffuse(...yellow);
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -2, 0); 
        this.scene.setDiffuse(...red);
        this.triangleRed.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.translate(2.5, -0.5, 0);
        this.scene.setDiffuse(...purple);
        this.trianglePurple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(3, 5, 0);
        this.scene.rotate(Math.PI/6, 0, 0, 1);
        this.scene.setDiffuse(...green);
        this.diamond.display();
        this.scene.popMatrix();
    }
}