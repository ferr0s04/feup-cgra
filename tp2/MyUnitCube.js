import {CGFobject} from '../lib/CGF.js';
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
			-0.5, -0.5, -0.5,	//0
			0.5, -0.5, -0.5,	//1
			0.5, 0.5, -0.5,	    //2
            -0.5, 0.5, -0.5,	//3
			-0.5, 0.5, 0.5,	    //4
            0.5, 0.5, 0.5,   	//5
            0.5, -0.5, 0.5,	    //6
            -0.5, -0.5, 0.5,	//7
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			2, 1, 0,
			0, 3, 2,
            1, 2, 5,
            5, 6, 1,
            5, 2, 3,
            3, 4, 5,
            4, 7, 6,
            6, 5, 4,
            7, 4, 3,
            3, 0, 7,
            6, 7, 0,
            0, 1, 6
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

