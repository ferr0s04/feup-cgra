import { CGFobject } from '../lib/CGF.js';

/**
 * MyQuad
 * @constructor
 * @param scene - Reference to MyScene object
 * @param customVertices - Optional custom vertices for the quad
 * @param coords - Optional texture coordinates for the quad
 */
export class MyQuad extends CGFobject {
	constructor(scene, customVertices, coords) {
		super(scene);
		this.customVertices = customVertices;
		this.initBuffers();
		if (coords != undefined)
			this.updateTexCoords(coords);
	}

	initBuffers() {
		this.vertices = this.customVertices || [
			-0.5, -0.5, 0,  // 0
			0.5, -0.5, 0,   // 1
			-0.5, 0.5, 0,   // 2
			0.5, 0.5, 0     // 3
		];

		const numVertices = this.vertices.length / 3;

		if (numVertices === 3) {
			this.indices = [0, 1, 2];
		} else if (numVertices === 4) {
			this.indices = [0, 1, 2, 1, 3, 2];
		} else {
			console.error("MyQuad: Only 3 or 4 vertices are supported.");
			return;
		}

		this.normals = this.computeNormals(this.vertices, this.indices);

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		];
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	computeNormals(vertices, indices) {
		const getVec3 = (i) => [
			vertices[3 * i],
			vertices[3 * i + 1],
			vertices[3 * i + 2]
		];

		const a = getVec3(indices[0]);
		const b = getVec3(indices[1]);
		const c = getVec3(indices[2]);

		const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
		const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];

		const nx = ab[1] * ac[2] - ab[2] * ac[1];
		const ny = ab[2] * ac[0] - ab[0] * ac[2];
		const nz = ab[0] * ac[1] - ab[1] * ac[0];

		const length = Math.hypot(nx, ny, nz);
		const normal = length === 0 ? [0, 0, 1] : [nx / length, ny / length, nz / length];

		return new Array(vertices.length / 3).fill(null).flatMap(() => normal);
	}

	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}
