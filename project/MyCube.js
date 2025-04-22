import { CGFobject } from "../lib/CGF.js";

export class MyCube extends CGFobject {
  constructor(scene, vertices) {
    super(scene);

    this.vertices = new Float32Array(vertices);

    // Indices fixos para desenhar um paralelepipedo com 24 vertices (4 por face)
    this.indices = new Uint16Array([
      0, 1, 2, 0, 2, 3, // Frente
      3, 2, 0, 2, 1, 0,
      4, 5, 6, 4, 6, 7, // Tras
      7, 6, 4, 6, 5, 4,
      8, 9,10, 8, 10, 11, // Esquerda
      11, 10, 8, 10, 9, 8,
      12, 13, 14, 12, 14, 15, // Direita
      15, 14, 12, 14, 13, 12,
      16, 17, 18, 16, 18, 19, // Cima
      19, 18, 16, 18, 17, 16,
      20, 21, 22, 20, 22, 23, // Base
      23, 22, 20, 22, 21, 20
    ]);

    this.normals = [
      0, 0, 1, // Frente (+z)
      0, 0, 1,  
      0, 0, 1,  
      0, 0, 1,
      0, 0, -1, // Tras (-z)
      0, 0, -1,  
      0, 0, -1,  
      0, 0, -1,
      -1, 0, 0, // Esquerda (-x)
      -1, 0, 0,  
      -1, 0, 0,  
      -1, 0, 0,
      1, 0, 0, // Direita (+x)
      1, 0, 0,  
      1, 0, 0,  
      1, 0, 0,
      0, 1, 0, // Cima (+y)
      0, 1, 0,  
      0, 1, 0,  
      0, 1, 0,
      0, -1, 0, // Base (-y)
      0, -1, 0,  
      0, -1, 0,  
      0, -1, 0
    ];
  
    this.initBuffers();
  }

  initBuffers() {
    const gl = this.scene.gl;
  
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
  
    // Buffer de vertices
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
  
    // Buffer de normais
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);
  
    // Buffer de indices
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
  
    gl.bindVertexArray(null);
  }
  

  display() {
    const gl = this.scene.gl;
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}

