import { CGFobject } from '../lib/CGF.js';

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Front
            -0.5, -0.5, 0.5,   // 0
             0.5, -0.5, 0.5,   // 1
             0.5,  0.5, 0.5,   // 2
            -0.5,  0.5, 0.5,   // 3

            // Back
            -0.5, -0.5, -0.5,  // 4
             0.5, -0.5, -0.5,  // 5
             0.5,  0.5, -0.5,  // 6
            -0.5,  0.5, -0.5,  // 7

            // Left
            -0.5, -0.5, -0.5,  // 8
            -0.5, -0.5,  0.5,  // 9
            -0.5,  0.5,  0.5,  // 10
            -0.5,  0.5, -0.5,  // 11

            // Right
             0.5, -0.5, -0.5,  // 12
             0.5, -0.5,  0.5,  // 13
             0.5,  0.5,  0.5,  // 14
             0.5,  0.5, -0.5,  // 15

            // Bottom
            -0.5, -0.5, -0.5,  // 16
             0.5, -0.5, -0.5,  // 17
             0.5, -0.5,  0.5,  // 18
            -0.5, -0.5,  0.5,  // 19

            // Top
            -0.5,  0.5, -0.5,  // 20
             0.5,  0.5, -0.5,  // 21
             0.5,  0.5,  0.5,  // 22
            -0.5,  0.5,  0.5   // 23
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

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
