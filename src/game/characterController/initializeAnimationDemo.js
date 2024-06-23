import * as THREE from 'three';
import { skyboxesList } from '../../const/skyboxes';
import { FreeCamera } from '../camera/freeCamera';
import { DirectionalLight } from '../light/directionalLight';
import { Mesh } from '../terrain/mesh';
import { Grid } from '../terrain/grid';
import { BasicCharacterController } from './controller';
import { ThirdPersonViewCamera } from '../camera/thirdPersonCamera';

export class InitializeAnimationDemo {
	constructor(grassField) {
		this._cameraState = {
			thirdPersonCameraEnabled: false,
			freeCameraInstance: null,
			thirdPersonCameraInstance: null,
		}
		this._previousFrame = null;
		this._animate();
		this.grassField = grassField;
		this._initialize();
		this._loadAnimatedModel();
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
		this._initFreeCamera();

		const dirLight = new DirectionalLight()._dirLight;
		const amLight = new THREE.AmbientLight(0xFFFFFF, .25);
		const plane = new Mesh(500, 500, 10, 10)._mesh;
		const grid = new Grid(100, 10, 0xffffff, 0xffffff)._grid;

		this._scene.add(dirLight);
		this._scene.add(amLight);
		this._scene.add(plane);
		// this._scene.add(grid );

		if(this.grassField){
			this._scene.add(this.grassField );
		}
	}
	_initFreeCamera(){
		this._cameraState.freeCameraInstance = new FreeCamera(this._camera, this._renderer.domElement);
	}
	_disableThirdCameraView(){
		this._initFreeCamera();
		this._cameraState.thirdPersonCameraEnabled = false;
	}
	_enableThirdCameraView(){
		this._cameraState.freeCameraInstance._freeCamera.dispose();
		this._cameraState.thirdPersonCameraEnabled = true;
	}
	_loadAnimatedModel() {
		const params = {
			camera: this._camera,
			scene: this._scene,
			cameraState: this._cameraState,
			disableThirdCameraView: this._disableThirdCameraView.bind(this),
			enableThirdCameraView: this._enableThirdCameraView.bind(this),
		}
		this._controls = new BasicCharacterController(params);
		this._cameraState.thirdPersonCameraInstance = new ThirdPersonViewCamera({
			camera: this._camera,
			target: this._controls,
		})
	}
	_animate() {
		requestAnimationFrame((t) => {
			if (this._previousFrame === null) {
				this._previousFrame = t;
			}
			if(this.grassField){
				this.grassField.update(t);
			}
			this._renderer.render(this._scene, this._camera);
			this._step(t - this._previousFrame);
			this._previousFrame = t;
			this._animate();
		});
	}
	_step(timeElapsed) {
		const timeElapsedS = timeElapsed * 0.001;
		if (this._controls) {
			this._controls._update(timeElapsedS);
		}
		if(this._cameraState.thirdPersonCameraEnabled){
			this._cameraState.thirdPersonCameraInstance._update(timeElapsedS);
		}
	}
}