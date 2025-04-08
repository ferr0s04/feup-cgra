import { CGFobject } from "../lib/CGF.js";

export class MyCube extends CGFobject {
  constructor(scene, meshData) {
    super(scene);
    
    // Vértices no formato [x, y, z, x, y, z, ...]
    this.vertices = new Float32Array(meshData.vertices);

    // Índices são armazenados como "faces", que são arrays dentro de arrays
    this.indices = new Uint16Array(meshData.faces.flat());

    this.initBuffers();
  }

  initBuffers() {
    const gl = this.scene.gl;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Buffer de vértices
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    // Buffer de índices
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    // Ativar o atributo de posição no shader (assumindo localização 0)
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.bindVertexArray(null);
  }

  display() {
    const gl = this.scene.gl;
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}
