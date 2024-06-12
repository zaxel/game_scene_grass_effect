import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import {skyboxesList} from './const/skyboxes.js';



class InitializeAnimationDemo{
	constructor(){
		this._initialize();
	}
	_initialize(){
		this._scene = new THREE.Scene();
		this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		
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
		
		
		let dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
		dirLight.position.set(20, 100, 10);
		dirLight.target.position.set(0, 0, 0);
		dirLight.castShadow = true;
		dirLight.shadow.bias = -0.001;
		dirLight.shadow.mapSize.width = 2048;
		dirLight.shadow.mapSize.height = 2048;
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 500.0;
		dirLight.shadow.camera.near = 0.5;
		dirLight.shadow.camera.far = 500.0;
		dirLight.shadow.camera.left = 100;
		dirLight.shadow.camera.right = -100;
		dirLight.shadow.camera.top = 100;
		dirLight.shadow.camera.bottom = -100;
		
		let amLight = new THREE.AmbientLight(0x101010);
		
		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(100, 100, 10, 10),
			new THREE.MeshStandardMaterial({
					color: 0xFFFFFF,
		}));

		plane.castShadow = false;
		plane.receiveShadow = true;
		plane.rotation.x = -Math.PI / 2;
	
		this._scene.add(plane);
	
		this._scene.add(dirLight);
		this._scene.add(amLight);
	}
	_animate(){
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