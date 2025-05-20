attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord + vec2(0.002 * timeFactor, 0.002 * timeFactor);
    vec4 offsetTex = texture2D(uSampler, vTextureCoord);
    vec3 offset = aVertexNormal * 0.1 * offsetTex.b;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}