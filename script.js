import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {skyboxesList} from './const/skyboxes.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
	antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 10, 10, 10 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.set(75, 20, 0);


const loader = new THREE.CubeTextureLoader();

const texture = loader.load(skyboxesList.sh);
scene.background = texture;


const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 20, 0);
controls.update();


let dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
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

scene.add(dirLight);
scene.add(amLight);

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}