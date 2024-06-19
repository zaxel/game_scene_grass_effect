import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { skyboxesList } from './src/const/skyboxes.js';
import { ThirdPersonViewCamera } from './src/game/camera/thirdPersonCamera.js';
import { BasicCharacterController } from './src/game/characterController/controller.js';
import { DirectionalLight } from './src/game/light/directionalLight.js';



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

		let dirLight = new DirectionalLight()._dirLight;

		let amLight = new THREE.AmbientLight(0xFFFFFF, 0.25);

		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(200, 200, 10, 10),
			new THREE.MeshStandardMaterial({
				color: 0xCCCCCC,
			}));

		plane.castShadow = false;
		plane.receiveShadow = true;
		plane.rotation.x = -Math.PI / 2;

		this._scene.add(dirLight);
		this._scene.add(amLight);
		this._scene.add(plane);


		this._grid = new THREE.GridHelper( 100, 10, 0xffffff, 0xffffff );
		this._grid.material.opacity = 0.2;
		this._grid.material.depthWrite = false;
		this._grid.material.transparent = true;
		this._scene.add( this._grid );
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