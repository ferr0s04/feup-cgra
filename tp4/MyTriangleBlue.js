import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangleBlue
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBlue extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
        this.vertices = [
            0, 0, 0,	//0
            3, 0, 0,	//1
            0, 3, 0	    //2
        ];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,

			6, 5, 4,
		];

		this.normals = [
			0, 0, 1,  // 0
			0, 0, 1,  // 1
			0, 0, 1,  // 2
			0, 0, 1,  // 3

			0, 0, -1, // 4
			0, 0, -1, // 5
			0, 0, -1, // 6
			0, 0, -1  // 7
		];

		this.texCoords = [
            0.5, 0.5,
			1, 0,
            0, 0
		]

        //The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}

