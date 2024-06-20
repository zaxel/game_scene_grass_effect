uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}