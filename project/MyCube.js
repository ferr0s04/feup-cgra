import { CGFobject } from '../lib/CGF.js';

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Front
            0, 0, 1,   // 0
            1, 0, 1,   // 1
            1, 1, 1,   // 2
            0, 1, 1,   // 3

            // Back
            0, 0, 0,  // 4
            1, 0, 0,  // 5
            1, 1, 0,  // 6
            0, 1, 0,  // 7

            // Left
            0, 0, 0,  // 8
            0, 0, 1,  // 9
            0, 1, 1,  // 10
            0, 1, 0,  // 11

            // Right
            1, 0, 0,  // 12
            1, 0, 1,  // 13
            1, 1, 1,  // 14
            1, 1, 0,  // 15

            // Bottom
            0, 0, 0,  // 16
            1, 0, 0,  // 17
            1, 0, 1,  // 18
            0, 0, 1,  // 19

            // Top
            0, 1, 0,  // 20
            1, 1, 0,  // 21
            1, 1, 1,  // 22
            0, 1, 1   // 23
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

        this.texCoords = [
            // Front
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Back
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Left
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Right
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Bottom
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Top
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
