import { CGFobject } from '../lib/CGF.js';

/**
 * MyTrianglePink
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTrianglePink extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 0, 0,  // 0
            2, 0, 0,  // 1
            2, -2, 0, // 2

            0, 0, 0,  // 3
            2, 0, 0,  // 4
            2, -2, 0  // 5
        ];

		//Counter-clockwise reference of vertices
        this.indices = [
            2, 1, 0,
            3, 4, 5
        ];

        this.normals = [
            0, 0, 1,  // 0
            0, 0, 1,  // 1
            0, 0, 1,  // 2

            0, 0, -1, // 3
            0, 0, -1, // 4
            0, 0, -1  // 5
        ];

        //The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
