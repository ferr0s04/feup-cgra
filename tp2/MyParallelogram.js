import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 0, 0, //0
            2, 0, 0, //1
            3, -1, 0, //2
            1, -1, 0, //3
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            2, 3, 0,
            2, 1, 0,
            0, 3, 2
        ];

        this.colors = [
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    /*initGLBuffers() {
        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.scene.gl.createBuffer());
        this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.scene.gl.STATIC_DRAW);

        this.scene.gl.bindBuffer(this.scene.gl.ELEMENT_ARRAY_BUFFER, this.scene.gl.createBuffer());
        this.scene.gl.bufferData(this.scene.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.scene.gl.STATIC_DRAW);

        this.scene.gl.bindBuffer(this.scene.gl.ARRAY_BUFFER, this.scene.gl.createBuffer());
        this.scene.gl.bufferData(this.scene.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.scene.gl.STATIC_DRAW);

        let colorAttrib = this.scene.gl.getAttribLocation(this.scene.program, 'aVertexColor');
        this.scene.gl.enableVertexAttribArray(colorAttrib);
        this.scene.gl.vertexAttribPointer(colorAttrib, 4, this.scene.gl.FLOAT, false, 0, 0);
    }*/
}

