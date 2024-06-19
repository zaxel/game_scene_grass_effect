import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class FreeCamera{
    constructor(camera, element){
        this._freeCamera;
        this._initCamera(camera, element);
    }
    _initCamera(camera, element){
        this._freeCamera = new OrbitControls(camera, element);
        this._freeCamera.target.set(0, 20, 0);
        this._freeCamera.update();
    }
}