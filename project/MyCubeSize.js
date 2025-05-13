import { CGFobject } from '../lib/CGF.js';

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCubeSize extends CGFobject {
    constructor(scene, xi, xf, yi, yf, zi, zf) {
        super(scene);
        this.xi = xi;
        this.xf = xf;
        this.yi = yi;
        this.yf = yf;
        this.zi = zi;
        this.zf = zf;
    }

    initBuffers() {
        this.vertices = [
            // Front
            xi, yi, zf,   // 0
            xf, yi, zf,   // 1
            xf, yf, zf,   // 2
            xi, yf, zf,   // 3

            // Back
            xi, yi, zi,  // 4
            xf, yi, zi,  // 5
            xf, yf, zi,  // 6
            xi, yf, zi,  // 7

            // Left
            xi, yi, zi,  // 8
            xi, yi, zf,  // 9
            xi, yf, zf,  // 10
            xi, yf, zi,  // 11

            // Right
            xf, yi, zi,  // 12
            xf, yi, zf,  // 13
            xf, yf, zf,  // 14
            xf, yf, zi,  // 15

            // Bottom
            xi, yi, zi,  // 16
            xf, yi, zi,  // 17
            xf, yi, zf,  // 18
            xi, yi, zf,  // 19

            // Top
            xi, yf, zi,  // 20
            xf, yf, zi,  // 21
            xf, yf, zf,  // 22
            xi, yf, zf   // 23
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
