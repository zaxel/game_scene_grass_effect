import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import {skyboxesList} from './const/skyboxes.js';

const characterActions = ['dance', 'dance2', 'dance3', 'arguing', 'capoeira', 'pray'];


class State {
	constructor(parent) {
		this._parent = parent;
	}
	
	enter() {}
	exit() {}
	update() {}
};

class JumpState extends State {
	static _jumpStates = ['jumpStand', 'jumpWalkFwd', 'jumpWalkBwd', 'jumpRunFwd', 'jumpRunBwd'];
	constructor(parent) {
		super(parent);
		this._finishedCallback = () => {
			this._finished();
		}
	}
	
	get Name() {
		return 'jumpStand';
	}
	
	
	
	enter(prevState) {
		console.log(this)
	  const curAction = this._parent._proxy._animations['jumpStand'].action;
	  const mixer = curAction.getMixer();
	  mixer.addEventListener('finished', this._finishedCallback);
  
	  if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;

		curAction.reset();  
		curAction.setLoop(THREE.LoopOnce, 1);
		curAction.clampWhenFinished = true;
		curAction.crossFadeFrom(prevAction, 0.2, true);
		curAction.play();
	  } else {
		curAction.play();
	  }
	}
  
	_finished() {
	  this._cleanup();
	  this._parent.setState('idle');
	}
  
	_cleanup() {
	  const action = this._parent._proxy._animations['jumpStand'].action;
	  action.getMixer().removeEventListener('finished', this._finishedCallback);
	}
  
	exit() {
	  this._cleanup();
	}
  
	update() {
	}
  };

class RunFWDState extends State {
	constructor(parent) {
	  super(parent);
	}
  
	get Name() {
	  return 'run_fwd';
	}
  
	enter(prevState) {
	  const curAction = this._parent._proxy._animations['run_fwd'].action;
	  if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
		curAction.enabled = true;
  
		if (prevState.Name == 'walk_fwd') {
		  const ratio = curAction.getClip().duration / prevAction.getClip().duration;
		  curAction.time = prevAction.time * ratio;
		} else {
		  curAction.time = 0.0;
		  curAction.setEffectiveTimeScale(1.0);
		  curAction.setEffectiveWeight(1.0);
		}
  
		curAction.crossFadeFrom(prevAction, 0.5, true);
		curAction.play();
	  } else {
		curAction.play();
	  }
	}
  
	exit() {
	}
  
	update(timeElapsed, input) {
	  if (input._keys.forward && input._keys.shift) {
		return;
	  }
	  if (input._keys.forward && !input._keys.shift) {
		  this._parent.setState('walk_fwd');
		return;
	  }
	  if (input._keys.backward) {
		  this._parent.setState('walk_bwd');
		return;
	  }

		this._parent.setState('idle');
	}

  };
class RunBWDState extends State {
	constructor(parent) {
	  super(parent);
	}
  
	get Name() {
	  return 'run_bwd';
	}
  
	enter(prevState) {
	  const curAction = this._parent._proxy._animations['run_bwd'].action;
	  if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
		curAction.enabled = true;
  
		if (prevState.Name == 'walk_bwd') {
		  const ratio = curAction.getClip().duration / prevAction.getClip().duration;
		  curAction.time = prevAction.time * ratio;
		} else {
		  curAction.time = 0.0;
		  curAction.setEffectiveTimeScale(1.0);
		  curAction.setEffectiveWeight(1.0);
		}
  
		curAction.crossFadeFrom(prevAction, 0.5, true);
		curAction.play();
	  } else {
		curAction.play();
	  }
	}
  
	exit() {
	}
  
	update(timeElapsed, input) {
	  if (input._keys.backward && input._keys.shift) {
		return;
	  }
	  if (input._keys.backward && !input._keys.shift) {
		  this._parent.setState('walk_bwd');
		return;
	  }
	  if (input._keys.forward) {
		  this._parent.setState('walk_fwd');
		return;
	  }

		this._parent.setState('idle');
	}

  };
  

  class WalkFWDState extends State {
	constructor(parent) {
	  super(parent);
	}
  
	get Name() {
	  return 'walk_fwd';
	}
  
	enter(prevState) {
	  const curAction = this._parent._proxy._animations['walk_fwd'].action;
	  if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
		curAction.enabled = true;
  
		if (prevState.Name == 'run_fwd') {
		  const ratio = curAction.getClip().duration / prevAction.getClip().duration;
		  curAction.time = prevAction.time * ratio;
		} else {
		  curAction.time = 0.0;
		  curAction.setEffectiveTimeScale(1.0);
		  curAction.setEffectiveWeight(1.0);
		}
  
		curAction.crossFadeFrom(prevAction, 0.5, true);
		curAction.play();
	  } else {
		curAction.play();
	  }
	}
  
	exit() {
	}
  
	update(_, input) {
	  if (input._keys.forward) {
		if (input._keys.shift) {
		  this._parent.setState('run_fwd');
		}
		return;
	  }
	  if (input._keys.backward) {
		  this._parent.setState('walk_bwd');
		return;
	  }
  	  this._parent.setState('idle');
	}
  };

  class WalkBWDState extends State {
	constructor(parent) {
	  super(parent);
	}
  
	get Name() {
	  return 'walk_bwd';
	}
  
	enter(prevState) {
	  const curAction = this._parent._proxy._animations['walk_bwd'].action;
	  if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
		curAction.enabled = true;
  
		if (prevState.Name == 'run_bwd') {
		  const ratio = curAction.getClip().duration / prevAction.getClip().duration;
		  curAction.time = prevAction.time * ratio;
		} else {
		  curAction.time = 0.0;
		  curAction.setEffectiveTimeScale(1.0);
		  curAction.setEffectiveWeight(1.0);
		}
  
		curAction.crossFadeFrom(prevAction, 0.5, true);
		curAction.play();
	  } else {
		curAction.play();
	  }
	}
  
	exit() {
	}
  
	update(_, input) {
		if (input._keys.backward) {
			if (input._keys.shift) {
			  this._parent.setState('run_bwd');
			}
			return;
		  }
		  if (input._keys.forward) {
			  this._parent.setState('walk_fwd');
			return;
		  }
			this._parent.setState('idle');
		}
	  
  };
  class ActionRandomizer{
	constructor(){
		this._index;
	}
	getRandomIndex(actions){
		if(!actions.length)
			return;
		this._index = Math.floor(Math.random()*actions.length);
		return this._index;  
	}
  }

class ActionState extends State {
	constructor(parent) {
	  super(parent);
	  this._actionIndexRandomizer = new ActionRandomizer().getRandomIndex;
	  this._updateActionIndex();
	  this._finishedCallback = () => {
		this._finished();
	  }
	}
  
	get Name() {
	  return this._curActionName;
	}

	_updateActionIndex() {
		this._actionIndex = this._actionIndexRandomizer(characterActions);
		this._curActionName = characterActions[this._actionIndex];
	}

	enter(prevState) {
	  this._updateActionIndex();
	  const curAction = this._parent._proxy._animations[this._curActionName].action;
	  const mixer = curAction.getMixer();
	  mixer.addEventListener('finished', this._finishedCallback);
  
	  if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;

		curAction.reset();  
		curAction.setLoop(THREE.LoopOnce, 1);
		curAction.clampWhenFinished = true;
		curAction.crossFadeFrom(prevAction, 0.2, true);
		curAction.play();
	  } else {
		curAction.play();
	  }
	}
  
	_finished() {
	  this._cleanup();
	  this._parent.setState('idle');
	}
  
	_cleanup() {
	  const action = this._parent._proxy._animations[this._curActionName].action;
	  action.getMixer().removeEventListener('finished', this._finishedCallback);
	}
  
	exit() {
	  this._cleanup();
	}
  
	update() {
	}
  };
  
  class IdleState extends State {
	constructor(parent) {
	  super(parent);
	}
  
	get Name() {
	  return 'idle';
	}
  
	enter(prevState) {
	  const idleAction = this._parent._proxy._animations['idle'].action;
	  if (prevState) {
		const prevAction = this._parent._proxy._animations[prevState.Name].action;
		idleAction.time = 0.0;
		idleAction.enabled = true;
		idleAction.setEffectiveTimeScale(1.0);
		idleAction.setEffectiveWeight(1.0);
		idleAction.crossFadeFrom(prevAction, 0.5, true);
		idleAction.play();
	  } else {
		idleAction.play();
	  }
	}
  
	exit() {
	}
  
	update(_, input) {
	  if (input._keys.forward) {
		this._parent.setState('walk_fwd');
	  } else if (input._keys.backward) {
		this._parent.setState('walk_bwd');
	  }else if (input._keys.space) {
		this._parent.setState('jump');
	  } else if (input._keys.action) {
		this._parent.setState('action');
	  }
	}
  };


class FiniteStateMachine {
	constructor() {
	  this._states = {};
	  this._currentState = null;
	}
  
	_addState(name, type) {
	  this._states[name] = type;
	}
  
	setState(name) {
	  const prevState = this._currentState;
	  
	  if (prevState) {
		if (prevState.Name == name) {
		  return;
		}
		prevState.exit();
	  }
	  console.log(name)
	  console.log(this._states)
	  const state = new this._states[name](this);
  
	  this._currentState = state;
	  state.enter(prevState);
	}
  
	update(timeElapsed, input) {
	  if (this._currentState) {
		this._currentState.update(timeElapsed, input);
	  }
	}
  };

  class CharacterFSM extends FiniteStateMachine {
	constructor(proxy) {
	  super();
	  this._proxy = proxy;
	  this._initStates();
	}
  
	_initStates() {
	  this._addState('idle', IdleState);
	  this._addState('walk_fwd', WalkFWDState);
	  this._addState('walk_bwd', WalkBWDState);
	  this._addState('run_fwd', RunFWDState);
	  this._addState('run_bwd', RunBWDState);
	  this._addState('action', ActionState);
	  this._addState('jump', JumpState);
	}
  };

  class BasicCharacterControllerProxy {
	constructor(animations){
	  this._animations = animations;
	}

	get animations(){
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
		action: false
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
		case 82: // r
		  this._keys.action = true;
		  break;
		case 16: // SHIFT
		  this._keys.shift = true;
		  break;
	  }
	}
  
	_onKeyUp(event) {
	  switch(event.keyCode) {
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
		case 82: // r
		  this._keys.action = false;
		  break;
		case 16: // SHIFT
		  this._keys.shift = false;
		  break;
	  }
	}
  };

class BasicCharacterController {
	constructor(params) {
	  this._initCharControl(params);
	}
  
	_initCharControl(params) {
	  this._params = params;
	  this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
	  this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
	  this._velocity = new THREE.Vector3(0, 0, 0);
  
	  this._animations = {};
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
  
		const jumpStates = this._stateMachine._states.jump._jumpStates;

		const loader = new FBXLoader(this._manager);
		loader.setPath('./models/animations/');
		loader.load('walk_fwd.fbx', anim => { _onLoad('walk_fwd', anim); });
		loader.load('walk_bwd.fbx', anim => { _onLoad('walk_bwd', anim); });
      	loader.load('run_fwd.fbx', anim => { _onLoad('run_fwd', anim); });
      	loader.load('run_bwd.fbx', anim => { _onLoad('run_bwd', anim); });
      	loader.load('idle.fbx', anim => { _onLoad('idle', anim); });
		characterActions.forEach(actionName=>loader.load(actionName + '.fbx', anim => { _onLoad(actionName, anim); }))
		jumpStates.forEach(actionName=>loader.load(actionName + '.fbx', anim => { _onLoad(actionName, anim); }))
	  });
	}
	_update(timeInSeconds){
		if (!this._target) {
			return;
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
	  
		  oldPosition.copy(controlObject.position);
	  
		  if (this._mixer) {
			this._mixer.update(timeInSeconds);
		  }
	}
  };
  
  



class InitializeAnimationDemo{
	constructor(){
    	this._previousFrame = null;

    	this._initialize();
    	this._loadAnimatedModel();
    	this._animate();
	}
	_initialize(){
		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
		
		this._renderer = new THREE.WebGLRenderer({
			antialias: true,
		});
		this._renderer.shadowMap.enabled = true;
		this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this._renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this._renderer.domElement );
		
		this._camera.position.set(75, 20, 0);
		
		
		const loader = new THREE.CubeTextureLoader();
		
		const texture = loader.load(skyboxesList.sh);
		texture.encoding = THREE.sRGBEncoding;
		this._scene.background = texture;
		
		
		const controls = new OrbitControls(this._camera, this._renderer.domElement);
		controls.target.set(0, 20, 0);
		controls.update();
		
		
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
			new THREE.PlaneGeometry(500, 500, 10, 10),
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
	  }
	
}

const _App = new InitializeAnimationDemo();