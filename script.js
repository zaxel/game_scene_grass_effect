import * as THREE from 'three';
import { skyboxesList } from './src/const/skyboxes.js';
import { ThirdPersonViewCamera } from './src/game/camera/thirdPersonCamera.js';
import { BasicCharacterController } from './src/game/characterController/controller.js';
import { DirectionalLight } from './src/game/light/directionalLight.js';
import { Mesh } from './src/game/terrain/mesh.js';
import { Grid } from './src/game/terrain/grid.js';
import { FreeCamera } from './src/game/camera/freeCamera.js';
import { loadShader, shadersMap } from './src/game/utils/loadShaders.js';



class InitializeAnimationDemo {
	constructor(grassField) {
		this._previousFrame = null;
		this.thirdPersonCamera = false;
		this._animate();
		this.grassField = grassField;
		this._initialize();
		// this._loadAnimatedModel();
	}
	_initialize() {
		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

		this._renderer = new THREE.WebGLRenderer({
			antialias: true,
		});
		this._renderer.shadowMap.enabled = true;
		this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this._renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this._renderer.domElement);

		this._camera.position.set(-30, 50, 70);

		const loader = new THREE.CubeTextureLoader();

		const texture = loader.load(skyboxesList.sh);
		texture.encoding = THREE.sRGBEncoding;
		this._scene.background = texture;
		if(!this.thirdPersonCamera){
			new FreeCamera(this._camera, this._renderer.domElement)._freeCamera;
		}

		const dirLight = new DirectionalLight()._dirLight;
		const amLight = new THREE.AmbientLight(0xFFFFFF, 0.25);
		const plane = new Mesh(200, 200, 10, 10)._mesh;
		const grid = new Grid(100, 10, 0xffffff, 0xffffff)._grid;

		this._scene.add(dirLight);
		this._scene.add(amLight);
		this._scene.add(plane);
		this._scene.add(grid );

		if(this.grassField){
			this._scene.add(this.grassField );
		}
	}
	_loadAnimatedModel() {
		const params = {
			camera: this._camera,
			scene: this._scene,
		}
		this._controls = new BasicCharacterController(params);

		this._thirdPersonViewCamera = new ThirdPersonViewCamera({
			camera: this._camera,
			target: this._controls,
		})
	}

	_animate() {
		requestAnimationFrame((t) => {
			if (this._previousFrame === null) {
				this._previousFrame = t;
			}
			this._animate();
			this._renderer.render(this._scene, this._camera);
			this._step(t - this._previousFrame);
			this._previousFrame = t;
		});
	}

	_step(timeElapsed) {
		const timeElapsedS = timeElapsed * 0.001;

		if (this._controls) {
			this._controls._update(timeElapsedS);
		}
		if(this.thirdPersonCamera){
			this._thirdPersonViewCamera._update(timeElapsedS);
		}
	}

}

class GrassMaterial{
	constructor(){
		this.grassMaskTexture = new THREE.TextureLoader().load( './public/textures/grass.jpg' );
		this.grassDiffTexture = new THREE.TextureLoader().load( './public/textures/grass_diffuse.jpg' );
	}

	grassMaterial( shaders ){
		const uniforms = {
			grassMaskTex: { value: this.grassMaskTexture },
			grassDiffTex: { value: this.grassDiffTexture },
			time: { type: 'float', value: 0 },
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

class GrassShaderMaterials{
	constructor(){
		this.grassMaskTex = new THREE.TextureLoader().load( '/textures/grass.jpg' );
		this.grassDiffTex = new THREE.TextureLoader().load( '/textures/grass_diffuse.jpg' );
	}

	shaderMaterial( shaders ){
		const uniforms = {
			time: { value: 0 },
			grassMaskTex: { value: this.grassMaskTex },
			grassDiffTex: { value: this.grassDiffTex },
		
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

class InitializeGrass extends THREE.Group{
	constructor(){
		super();
		this._axisHelper = new THREE.AxesHelper(3);
		this.add(this._axisHelper);

		this.grassMat = new THREE.MeshBasicMaterial({color: 0x026417});

		this.instances = 1;
		this.w = 10;
		this.d = 10;
		this.h = 0;

		this.positions = [];
		this.indices = [];
		this.uvs = [];

		this.geo;
		this.particles;
	}

	createParticles(){
		this.positions.push(5, -5, 0);
		this.positions.push(-5, -5, 0);
		this.positions.push(-5, 5, 0);
		this.positions.push(5, 5, 0);

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

		}

		this.geo = new THREE.InstancedBufferGeometry();
		this.geo.instanceCount = this.instances;

		this.geo.setAttribute( 'position', new THREE.Float32BufferAttribute( this.positions, 3 ) );
        this.geo.setAttribute( 'uv', new THREE.Float32BufferAttribute( this.uvs, 2 ) );
        this.geo.setIndex(new THREE.BufferAttribute(new Uint16Array( this.indices ), 1));


		const grassMaterialInstance = new GrassShaderMaterials();
		const grassMaterial = grassMaterialInstance.shaderMaterial(shadersMap);

		this.grassParticles = new THREE.Mesh(this.geo, grassMaterial);
        this.grassParticles.frustumCulled = false;
        this.add(this.grassParticles);

	}
	update(){

	}
}

class InitApp{
	async init(){
		await loadShader();
		this.grassField = new InitializeGrass();
		this.grassField.createParticles();
		new InitializeAnimationDemo(this.grassField);
	}
}


const _App = new InitApp().init();
