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
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Front
            this.xi, this.yi, this.zf,   // 0
            this.xf, this.yi, this.zf,   // 1
            this.xf, this.yf, this.zf,   // 2
            this.xi, this.yf, this.zf,   // 3

            // Back
            this.xi, this.yi, this.zi,  // 4
            this.xf, this.yi, this.zi,  // 5
            this.xf, this.yf, this.zi,  // 6
            this.xi, this.yf, this.zi,  // 7

            // Left
            this.xi, this.yi, this.zi,  // 8
            this.xi, this.yi, this.zf,  // 9
            this.xi, this.yf, this.zf,  // 10
            this.xi, this.yf, this.zi,  // 11

            // Right
            this.xf, this.yi, this.zi,  // 12
            this.xf, this.yi, this.zf,  // 13
            this.xf, this.yf, this.zf,  // 14
            this.xf, this.yf, this.zi,  // 15

            // Bottom
            this.xi, this.yi, this.zi,  // 16
            this.xf, this.yi, this.zi,  // 17
            this.xf, this.yi, this.zf,  // 18
            this.xi, this.yi, this.zf,  // 19

            // Top
            this.xi, this.yf, this.zi,  // 20
            this.xf, this.yf, this.zi,  // 21
            this.xf, this.yf, this.zf,  // 22
            this.xi, this.yf, this.zf   // 23
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

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
