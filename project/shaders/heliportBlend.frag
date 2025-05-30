#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
uniform float blendFactor;

void main(void) {
    vec4 colorH = texture2D(uSampler0, vTextureCoord);
    vec4 colorUP = texture2D(uSampler1, vTextureCoord);
    gl_FragColor = mix(colorH, colorUP, blendFactor);
}