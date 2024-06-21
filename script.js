import { loadShader } from './src/game/utils/loadShaders.js';
import { InitializeAnimationDemo } from './src/game/characterController/initializeAnimationDemo.js';
import { InitializeGrass } from './src/game/terrain/initializeGrass.js';

class InitApp{
	async init(){
		await loadShader();
		this.grassField = new InitializeGrass();
		this.grassField.createParticles();
		new InitializeAnimationDemo(this.grassField);
	}
}

const _App = new InitApp().init();
