attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float normScale;
uniform float timeFactor;

varying vec4 vertPosition;

void main() {
    float offsetX = sin(timeFactor) + normScale;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x + offsetX, aVertexPosition.y, aVertexPosition.z, 1.0);
    vertPosition = gl_Position;
}
