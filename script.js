import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {skyboxesList} from './const/skyboxes.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;


const loader = new THREE.CubeTextureLoader();

const texture = loader.load(skyboxesList.sh);
scene.background = texture;


const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 20, 0);
controls.update();

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}