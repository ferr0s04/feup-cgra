#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform sampler2D uMask;
uniform float uBrightness;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec4 filter = texture2D(uSampler2, vec2(0.0,0.1) + vTextureCoord);
    vec4 maskColor = texture2D(uMask, vTextureCoord);

    color.rgb *= uBrightness;

    gl_FragColor = vec4(color.rgb, 1.0 - maskColor.r);
}