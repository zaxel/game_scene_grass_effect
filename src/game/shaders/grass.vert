uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec3 terPos;

void main(){
    vec3 finalPos = position + terPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}