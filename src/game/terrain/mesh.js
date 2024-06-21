import * as THREE from 'three';

export class Mesh{
	constructor(w, h, wSegments, hSegments){
		this._mesh;
		this._initMesh(w, h, wSegments, hSegments);
	}
	_initMesh(w, h, wSegments, hSegments){
		this._mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(w, h, wSegments, hSegments),
			new THREE.MeshStandardMaterial({
				color: 0x88731F,
			}));

		this._mesh.castShadow = false;
		this._mesh.receiveShadow = true;
		this._mesh.rotation.x = -Math.PI / 2;
	}
}