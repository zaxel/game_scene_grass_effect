import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import {skyboxesList} from './const/skyboxes.js';


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
	//   this._stateMachine = new CharacterFSM(new BasicCharacterControllerProxy(this._animations));
  
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
		  this._state = 'idle';
		};
  
		
		const loader = new FBXLoader(this._manager);
		loader.load(
			'./models/animations/Idle.fbx',
			anim => {
				const clip = anim.animations[0];
				const action = this._mixer.clipAction(clip);
				action.play()
		});
	  });
	}
 
  };
  
  



class InitializeAnimationDemo{
	constructor(){
		this._initialize();
		this._loadAnimatedModel();
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
		this._renderer.setAnimationLoop( () => this._animate() );
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
	  }
	_animate(){
		if (this._controls._mixer) {
				this._controls._mixer.update(0.02);
			}
		this._renderer.render( this._scene, this._camera );
	}
}




function loadAnimatedModel(){
	const mainHeroLoader = new FBXLoader();

	mainHeroLoader.load( 
		'./models/characters/The_Boss.fbx', 
		function(fbx){
			fbx.scale.setScalar(0.1);
			fbx.traverse(c => {
				c.castShadow = true;
			})

			const modAnimation = new FBXLoader();
			modAnimation.load(
					'./models/animations/Twist_Dance.fbx', 
					anim => {
						mixer = new THREE.AnimationMixer(fbx);
						const idle = mixer.clipAction(anim.animations[0]);
						idle.play();
					}
				)

			scene.add( fbx);
		}, 
		undefined, 
		function(error){
			console.error( error );
		} 
	);
}
// loadAnimatedModel()



const _App = new InitializeAnimationDemo();