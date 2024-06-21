import * as THREE from 'three';
import { GrassShaderMaterials } from './grassShaderMaterials';
import { shadersMap } from '../utils/loadShaders';

export class InitializeGrass extends THREE.Group{
	constructor(){
		super();
		this._axisHelper = new THREE.AxesHelper(3);
		this.add(this._axisHelper);

		this.grassMat = new THREE.MeshBasicMaterial({color: 0x026417});

		this.instances = 10000;
		this.w = 100;
		this.d = 100;
		this.h = 0;

		this.terrainPositions = [];
		this.positions = [];
		this.indices = [];
		this.uvs = [];
		this.angles = [];

		this.geo;
		this.particles;
	}

	createParticles(){
		this.positions.push(4, -4, 0);
		this.positions.push(-4, -4, 0);
		this.positions.push(-4, 4, 0);
		this.positions.push(4, 4, 0);

		this.indices.push(0);
		this.indices.push(1);
		this.indices.push(2);
		this.indices.push(2);
		this.indices.push(3);
		this.indices.push(0);

		this.uvs.push(1.0, 0.0);
		this.uvs.push(0.0, 0.0);
		this.uvs.push(0.0, 1.0);
		this.uvs.push(1.0, 1.0);

		for(let i=0; i<this.instances; i++){
			let posX = Math.random() * this.w - this.w/2;
			let posY = this.h;
			let posZ = Math.random() * this.d - this.d/2;
			let angle = Math.random()*45;

			this.terrainPositions.push(posX, posY, posZ);
			this.angles.push(angle);
		}

		this.geo = new THREE.InstancedBufferGeometry();
		this.geo.instanceCount = this.instances;

		this.geo.setAttribute( 'position', new THREE.Float32BufferAttribute( this.positions, 3 ) );
        this.geo.setAttribute( 'uv', new THREE.Float32BufferAttribute( this.uvs, 2 ) );
        this.geo.setIndex(new THREE.BufferAttribute(new Uint16Array( this.indices ), 1));
		this.geo.setAttribute( 'terPos', new THREE.InstancedBufferAttribute( new Float32Array( this.terrainPositions ), 3 ) );
		this.geo.setAttribute( 'angle', new THREE.InstancedBufferAttribute( new Float32Array( this.angles ), 1 ) );

		const grassMaterialInstance = new GrassShaderMaterials();
		const grassMaterial = grassMaterialInstance.shaderMaterial(shadersMap);

		this.grassParticles = new THREE.Mesh(this.geo, grassMaterial);
        this.grassParticles.frustumCulled = false;
        this.add(this.grassParticles);

	}
	update(t){
		this.grassParticles.material.uniforms.time.value = t;
	}
}