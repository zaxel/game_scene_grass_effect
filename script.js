import * as THREE from 'three';
import { skyboxesList } from './src/const/skyboxes.js';
import { ThirdPersonViewCamera } from './src/game/camera/thirdPersonCamera.js';
import { BasicCharacterController } from './src/game/characterController/controller.js';
import { DirectionalLight } from './src/game/light/directionalLight.js';
import { Mesh } from './src/game/terrain/mesh.js';
import { Grid } from './src/game/terrain/grid.js';
import { FreeCamera } from './src/game/camera/freeCamera.js';

	

	class InitializeAnimationDemo {
	constructor() {
		this._previousFrame = null;
		this.thirdPersonCamera = true;
		this._initialize();
		this._loadAnimatedModel();
		this._animate();
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

const _App = new InitializeAnimationDemo();