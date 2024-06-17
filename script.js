import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { skyboxesList } from './src/const/skyboxes.js';
import { ThirdPersonViewCamera } from './src/game/camera/thirdPersonCamera.js';
import { BasicCharacterController } from './src/game/characterController/controller.js';


class InitializeAnimationDemo {
	constructor() {
		this._previousFrame = null;

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

		this._camera.position.set(0, 0, 0);

		const loader = new THREE.CubeTextureLoader();

		const texture = loader.load(skyboxesList.sh);
		texture.encoding = THREE.sRGBEncoding;
		this._scene.background = texture;

		// const controls = new OrbitControls(this._camera, this._renderer.domElement);
		// controls.target.set(0, 20, 0);
		// controls.update();

		let dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
		dirLight.position.set(-100, 100, 100);
		dirLight.target.position.set(0, 0, 0);
		dirLight.castShadow = true;
		dirLight.shadow.bias = -0.001;
		dirLight.shadow.mapSize.width = 4096;
		dirLight.shadow.mapSize.height = 4096;
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 500.0;
		dirLight.shadow.camera.near = 0.5;
		dirLight.shadow.camera.far = 500.0;
		dirLight.shadow.camera.left = 50;
		dirLight.shadow.camera.right = -50;
		dirLight.shadow.camera.top = 50;
		dirLight.shadow.camera.bottom = -50;

		let amLight = new THREE.AmbientLight(0xFFFFFF, 0.25);

		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(100, 100, 10, 10),
			new THREE.MeshStandardMaterial({
				color: 0xCCCCCC,
			}));

		plane.castShadow = false;
		plane.receiveShadow = true;
		plane.rotation.x = -Math.PI / 2;

		this._scene.add(dirLight);
		this._scene.add(amLight);
		this._scene.add(plane);
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
		this._thirdPersonViewCamera._update(timeElapsedS);
	}

}

const _App = new InitializeAnimationDemo();