import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        for (let z = 0 ; z <= this.stacks ; z += 1) { // Draw first line - at the end connects to the last line
            this.vertices.push(1, 0, z / this.stacks);
            this.normals.push(1, 0, 0);
        }

        for (let i = 1 ; i <= this.slices ; i += 1) {
            let angle = 2 * Math.PI * i / this.slices;
            let x = Math.cos(angle);
            let y = Math.sin(angle);

            let vector = 1; // Normalização

            if(i != this.slices){
                this.vertices.push(x, y, 0);
                this.normals.push(x/vector, y/vector, 0);
            }

            for (let j = 1 ; j <= this.stacks ; j += 1) {

                let z = j/this.stacks;

                let prov = this.vertices.length/3;

                if(i != this.slices) { // The last slice(line) is an exception

                    this.vertices.push(x, y, z);
                    this.normals.push(x/vector, y/vector, 0);
                    prov += 1;

                    let ponto1 = prov - 2;
                    let ponto2 = prov - 1;
                    let ponto3 = ponto2 - (this.stacks + 1);
                    let ponto4 = ponto3 - 1;
                    this.indices.push(ponto4, ponto1, ponto2);
                    this.indices.push(ponto4, ponto2, ponto3);

                } else {

                    let ponto1 = j - 1;
                    let ponto2 = j;
                    let ponto3 = prov - this.stacks - 1 + j;
                    let ponto4 = ponto3 - 1;
                    
                    this.indices.push(ponto4, ponto1, ponto2); 
                    this.indices.push(ponto4, ponto2, ponto3); 

                }
                
            }

        }

        // Base
        const centerIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 1);
        this.normals.push(0, 0, -1);

        for (let i = 0; i < this.slices; i++) {
            let angle = 2 * Math.PI * i / this.slices;
            let x = Math.cos(angle);
            let y = Math.sin(angle);

            const index = this.vertices.length / 3;
            this.vertices.push(x, y, 1);
            this.normals.push(0, 0, -1);

            this.indices.push(centerIndex, index, index + 1);
        }

        // Fecha o círculo da base
        this.indices[this.indices.length - 1] = centerIndex + 1;


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity){}

}
