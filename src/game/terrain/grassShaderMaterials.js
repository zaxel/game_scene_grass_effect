import * as THREE from 'three';

export class GrassShaderMaterials{
	constructor(){
		this.grassMaskTexture = new THREE.TextureLoader().load( '/textures/grass.jpg' );
		this.grassDiffTexture = new THREE.TextureLoader().load( '/textures/grass_diffuse.jpg' );
	}

	shaderMaterial( shaders ){
		const uniforms = {
			time: { value: 0 },
			grassMaskTexture: { value: this.grassMaskTexture },
			grassDiffTexture: { value: this.grassDiffTexture },
		
		};

		const Grass_VS = shaders.get('grass_VS');
		const Grass_FS = shaders.get('grass_FS');
	
		const basicShaderMaterial = new THREE.RawShaderMaterial( {
	
			uniforms: uniforms,
			vertexShader: Grass_VS,
			fragmentShader: Grass_FS,
			// blending: THREE.AdditiveBlending,
			side:THREE.DoubleSide,
			// depthTest : false,
			// depthWrite : false,
			// transparent: true, 
			// vertexColors: true
		} );
		return basicShaderMaterial;
	}
}