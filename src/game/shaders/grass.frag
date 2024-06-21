precision mediump float;

uniform sampler2D grassMaskTexture;
uniform sampler2D grassDiffTexture;

varying vec2 vUv;

void main(){
    vec3 maskColor = texture2D(grassMaskTexture, vUv).rgb;
    vec3 finalColor = texture2D(grassDiffTexture, vUv).rgb;

    gl_FragColor = vec4(finalColor, 1.0);

    if(maskColor.r <= 0.1){
        discard;
    }
}