import * as THREE from 'three';
import { CharacterFSM, JumpState } from './actionStates';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { characterActions } from '../../const/characterActions';

class BasicCharacterControllerProxy {
	constructor(animations) {
		this._animations = animations;
	}

	get animations() {
		return this._animations;
	}
};

class BasicButtonPressedController {
	constructor() {
		this._init();
	}

	_init() {
		this._keys = {
			forward: false,
			backward: false,
			left: false,
			right: false,
			space: false,
			shift: false,
			action: false,
			thirdPersonCamera: false,
			freeCamera: false,
		};
		document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
		document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
	}

	_onKeyDown(event) {
		switch (event.keyCode) {
			case 87: // w
			case 38: // arrow up
				this._keys.forward = true;
				break;
			case 65: // a
			case 37: // arrow left
				this._keys.left = true;
				break;
			case 83: // s
			case 40: // arrow down
				this._keys.backward = true;
				break;
			case 68: // d
			case 39: // arrow right
				this._keys.right = true;
				break;
			case 32: // SPACE
				this._keys.space = true;
				break;
			case 17: // CTRL
				this._keys.ctrl = true;
				break;
			case 82: // r
				this._keys.action = true;
				break;
			case 16: // SHIFT
				this._keys.shift = true;
				break;
			case 84: // t
				this._keys.thirdPersonCamera = true;
				break;
			case 70: // f
				this._keys.freeCamera = true;
				break;
		}
	}

	_onKeyUp(event) {
		switch (event.keyCode) {
			case 87: // w
			case 38: // arrow up
				this._keys.forward = false;
				break;
			case 65: // a
			case 37: // arrow left
				this._keys.left = false;
				break;
			case 83: // s
			case 40: // arrow down
				this._keys.backward = false;
				break;
			case 68: // d
			case 39: // arrow right
				this._keys.right = false;
				break;
			case 32: // SPACE
				this._keys.space = false;
				break;
			case 17: // CTRL
				this._keys.ctrl = false;
				break;
			case 82: // r
				this._keys.action = false;
				break;
			case 16: // SHIFT
				this._keys.shift = false;
				break;
			case 84: // t
				this._keys.thirdPersonCamera = false;
				break;
			case 70: // f
				this._keys.freeCamera = false;
				break;
		}
	}
};

export class BasicCharacterController {
	constructor(params) {
		this._initCharControl(params);
	}

	_initCharControl(params) {
		this._params = params;
		this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
		this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
		this._velocity = new THREE.Vector3(0, 0, 0);
		this._position = new THREE.Vector3();

		this._animations = {};
		this.thirdCameraViewEnabled = params.thirdPersonCameraEnabled;
		this._input = new BasicButtonPressedController();
		this._stateMachine = new CharacterFSM(new BasicCharacterControllerProxy(this._animations));

		this._loadModels();
	}

	_loadModels() {
		const loader = new FBXLoader();
		loader.load('./models/characters/Big_Vegas.fbx', (fbx) => {
			fbx.scale.setScalar(0.1);
			fbx.traverse(c => {
				c.castShadow = true;
			});

			this._target = fbx;
			this._params.scene.add(this._target);

			this._mixer = new THREE.AnimationMixer(this._target);

			this._manager = new THREE.LoadingManager();
			this._manager.onLoad = () => {
				this._stateMachine.setState('idle');
			};

			const _onLoad = (animName, anim) => {
				const clip = anim.animations[0];
				const action = this._mixer.clipAction(clip);

				this._animations[animName] = {
					clip: clip,
					action: action,
				};
			};

			const jumpStates = JumpState._jumpStates;

			const loader = new FBXLoader(this._manager);
			loader.setPath('./models/animations/');
			loader.load('walk_fwd.fbx', anim => { _onLoad('walk_fwd', anim); });
			loader.load('walk_bwd.fbx', anim => { _onLoad('walk_bwd', anim); });
			loader.load('run_fwd.fbx', anim => { _onLoad('run_fwd', anim); });
			loader.load('run_bwd.fbx', anim => { _onLoad('run_bwd', anim); });
			loader.load('idle.fbx', anim => { _onLoad('idle', anim); });
			characterActions.forEach(actionName => loader.load(actionName + '.fbx', anim => { _onLoad(actionName, anim); }))
			jumpStates.forEach(actionName => loader.load(actionName + '.fbx', anim => { _onLoad(actionName, anim); }))
		});
	}

	_update(timeInSeconds) {
		if (!this._target) {
			return;
		}
		if (this._input._keys.thirdPersonCamera) {
			if(!this._params.cameraState.thirdPersonCameraEnabled){
				this._params.enableThirdCameraView();
				return;
			}
		}
		if (this._input._keys.freeCamera) {
			if(this._params.cameraState.thirdPersonCameraEnabled){
				this._params.disableThirdCameraView();
				return;
			}
		}
		this._stateMachine.update(timeInSeconds, this._input);

		const velocity = this._velocity;
		const frameDecceleration = new THREE.Vector3(
			velocity.x * this._decceleration.x,
			velocity.y * this._decceleration.y,
			velocity.z * this._decceleration.z
		);
		frameDecceleration.multiplyScalar(timeInSeconds);
		frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
			Math.abs(frameDecceleration.z), Math.abs(velocity.z));

		velocity.add(frameDecceleration);

		const controlObject = this._target;
		const _Q = new THREE.Quaternion();
		const _A = new THREE.Vector3();
		const _R = controlObject.quaternion.clone();

		const acc = this._acceleration.clone();
		if (this._input._keys.shift) {
			acc.multiplyScalar(2.0);
		}

		if (this._input._keys.forward) {
			velocity.z += acc.z * timeInSeconds;
		}
		if (this._input._keys.backward) {
			velocity.z -= acc.z * timeInSeconds;
		}
		if (this._input._keys.left) {
			_A.set(0, 1, 0);
			_Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
			_R.multiply(_Q);
		}
		if (this._input._keys.right) {
			_A.set(0, 1, 0);
			_Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
			_R.multiply(_Q);
		}

		controlObject.quaternion.copy(_R);

		const oldPosition = new THREE.Vector3();
		oldPosition.copy(controlObject.position);

		const forward = new THREE.Vector3(0, 0, 1);
		forward.applyQuaternion(controlObject.quaternion);
		forward.normalize();

		const sideways = new THREE.Vector3(1, 0, 0);
		sideways.applyQuaternion(controlObject.quaternion);
		sideways.normalize();

		sideways.multiplyScalar(velocity.x * timeInSeconds);
		forward.multiplyScalar(velocity.z * timeInSeconds);

		controlObject.position.add(forward);
		controlObject.position.add(sideways);

		this._position.copy(controlObject.position);

		if (this._mixer) {
			this._mixer.update(timeInSeconds);
		}
	}
	get position() {
		return this._position;
	  }
	
	get rotation() {
		if (!this._target) {
		  return new THREE.Quaternion();
		}
		return this._target.quaternion;
	}
};