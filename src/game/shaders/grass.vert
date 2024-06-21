uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform float time;

attribute vec3 position;
attribute vec3 terPos;
attribute vec2 uv;
attribute float angle;

varying vec2 vUv;

vec4 quaterFromAxisAngle(vec3 axis, float angle){ 
    vec4 qtr;
    float halfAngle = (angle * 0.5) * 3.14159 / 180.0;
    qtr.x = axis.x * sin(halfAngle);
    qtr.y = axis.y * sin(halfAngle);
    qtr.z = axis.z * sin(halfAngle);
    qtr.w = cos(halfAngle);
    return qtr;
}

vec3 rotateVertPos(vec3 position, vec3 axis, float angle){

    vec4 q = quaterFromAxisAngle(axis, angle);
    vec3 v = position.xyz;
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);

}

void main(){
    vUv = uv;
    vec3 finalPos = position;
    vec3 rotateAxis = vec3(0.0, 1.0, 0.0);

    finalPos.x *= .1;
    finalPos.y += 4.0;

    if(finalPos.y > 4.0){
        finalPos.x = (finalPos.x + sin(time / 100.0 * (angle * 0.01)) * 0.3);
        finalPos.z = (finalPos.z + cos(time / 100.0 * (angle * 0.01)) * 0.5);
    }

    finalPos = rotateVertPos(finalPos, rotateAxis, angle);

    finalPos += terPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}