import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, top, front, right, back, left, bottom) {
        super(scene);
        this.quad = new MyQuad(scene);
        this.top = top;
        this.front = front;
        this.right = right;
        this.back = back;
        this.left = left;
        this.bottom = bottom;
    }

    display() {
        // Front face
        this.scene.pushMatrix();
        if (this.front) {
            this.front.bind();
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        }
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();
    
        // Back face
        this.scene.pushMatrix();
        if (this.back) {
            this.back.bind();
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        }
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
    
        // Left face
        this.scene.pushMatrix();
        if (this.left) {
            this.left.bind();
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        }
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
    
        // Right face
        this.scene.pushMatrix();
        if (this.right) {
            this.right.bind();
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        }
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
    
        // Top face
        this.scene.pushMatrix();
        if (this.top) {
            this.top.bind();
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        }
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();
    
        // Bottom face
        this.scene.pushMatrix();
        if (this.bottom) {
            this.bottom.bind();
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        }
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();
    }
    
}
