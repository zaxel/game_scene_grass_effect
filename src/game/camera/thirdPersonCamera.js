import * as THREE from 'three';

export class ThirdPersonViewCamera {
	constructor(params) {
		this._params = params;
		this._camera = params.camera;
		this._position = new THREE.Vector3();
		this._lookAt = new THREE.Vector3();
	}
	_calcTransformedPosition(x, y, z){
		const transformedPosition  = new THREE.Vector3(x,y,z);
		transformedPosition .applyQuaternion(this._params.target.rotation);
		transformedPosition .add(this._params.target.position);
		return transformedPosition ;
	}
	_calcIdealOffset() {
		return this._calcTransformedPosition(-20, 20, -30);
	}
	_calcIdealLookAt() {
		return this._calcTransformedPosition(0, 10, 40);
	}
	_update(timeElapsedS) {
		const idealOffset = this._calcIdealOffset();
		const idealLookAt = this._calcIdealLookAt();
		const t = 1 - .001 ** timeElapsedS;

		this._position.lerp(idealOffset, t);
		this._lookAt.lerp(idealLookAt, t);

		this._camera.position.copy(this._position);
		this._camera.lookAt(this._lookAt);
	}
}