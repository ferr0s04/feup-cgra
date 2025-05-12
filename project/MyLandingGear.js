import {CGFobject} from '../lib/CGF.js';

export class MyLandingGear extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() { 
        this.vertices = [
            0, 0, 5,   // 0
            0.3, 0, 5,   // 1
            0.3, 0.25, 5,   // 2
            0, 0.25, 5,   // 3
            0, 0, 0,  // 4
            0.3, 0, 0,  // 5
            0.3, 0.25, 0,  // 6
            0, 0.25, 0,  // 7
            0, 0, 0,  // 8
            0, 0, 5,  // 9
            0, 0.25, 5,  // 10
            0, 0.25, 0,  // 11
            0.3, 0, 0,  // 12
            0.3, 0, 5,  // 13
            0.3, 0.25, 5,  // 14
            0.3, 0.25, 0,  // 15
            0, 0, 0,  // 16
            0.3, 0, 0,  // 17
            0.3, 0, 5,  // 18
            0, 0, 5,  // 19
            0, 0.25, 0,  // 20
            0.3, 0.25, 0,  // 21
            0.3, 0.25, 5,  // 22
            0, 0.25, 5   // 23
        ];

		//Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            2, 3, 0,
            6, 5, 4,
            4, 7, 6,
            8, 9, 10,
            10, 11, 8,
            14, 13, 12,
            12, 15, 14,
            16, 17, 18,
            18, 19, 16,
            22, 21, 20,
            20, 23, 22
        ];

        this.normals = [
            // Front
             0,  0,  1,  
             0,  0,  1,  
             0,  0,  1,  
             0,  0,  1,  

            // Back
             0,  0, -1,  
             0,  0, -1,  
             0,  0, -1,  
             0,  0, -1,  

            // Left
            -1,  0,  0,  
            -1,  0,  0,  
            -1,  0,  0,  
            -1,  0,  0,  

            // Right
             1,  0,  0,  
             1,  0,  0,  
             1,  0,  0,  
             1,  0,  0,  

            // Bottom
             0, -1,  0,  
             0, -1,  0,  
             0, -1,  0,  
             0, -1,  0,  

            // Top
             0,  1,  0,  
             0,  1,  0,  
             0,  1,  0,  
             0,  1,  0   
        ];
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    

    display() {
        this.scene.pushMatrix();
        this.scene.translate(20, 1, 0); // move to be in front of camera
        super.display();
        this.scene.popMatrix();

      }

}