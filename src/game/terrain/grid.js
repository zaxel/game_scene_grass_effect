import * as THREE from 'three';

export class Grid{
    constructor(size, divisions, colorCenterLine, colorGrid){
        this._grid;
        this._initGrid(size, divisions, colorCenterLine, colorGrid);
    }
    _initGrid(size, divisions, colorCenterLine, colorGrid){
        this._grid = new THREE.GridHelper( size, divisions, colorCenterLine, colorGrid);
        this._grid.material.opacity = 0.2;
        this._grid.material.depthWrite = false;
        this._grid.material.transparent = true;
    }
}