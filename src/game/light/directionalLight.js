import * as THREE from 'three';

export class DirectionalLight{
	constructor(color = 0xFFFFFF, intensity = 1.0){
		this._dirLight;
		this._initDirLight(color, intensity);
	}
	_initDirLight(color, intensity){
		this._dirLight = new THREE.DirectionalLight(color, intensity);
		this._dirLight.position.set(-100, 100, 100);
		this._dirLight.target.position.set(0, 0, 0);
		this._dirLight.castShadow = true;
		this._dirLight.shadow.bias = -0.001;
		this._dirLight.shadow.mapSize.width = 4096;
		this._dirLight.shadow.mapSize.height = 4096;
		this._dirLight.shadow.camera.near = 0.1;
		this._dirLight.shadow.camera.far = 500.0;
		this._dirLight.shadow.camera.near = 0.5;
		this._dirLight.shadow.camera.far = 500.0;
		this._dirLight.shadow.camera.left = 50;
		this._dirLight.shadow.camera.right = -50;
		this._dirLight.shadow.camera.top = 50;
		this._dirLight.shadow.camera.bottom = -50;
	}
}