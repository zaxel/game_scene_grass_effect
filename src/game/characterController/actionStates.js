import * as THREE from 'three';
import { characterActions } from '../../const/characterActions';

class State {
	constructor(parent) {
		this._parent = parent;
	}

	enter() { }
	exit() { }
	update() { }
};

export class JumpState extends State {
	static _jumpStates = ['jumpStand', 'jumpBwd', 'jumpFwd'];
	constructor(parent, jumpType) {
		super(parent);
		this._jumpType = jumpType;;
		this._finishedCallback = () => {
			this._finished();
		}
	}


	get Name() {
		return this._jumpType;
	}

	enter(prevState) {
		const curAction = this._parent._proxy._animations[this._jumpType].action;
		const mixer = curAction.getMixer();
		mixer.addEventListener('finished', this._finishedCallback);

		if (prevState) {
			const prevAction = this._parent._proxy._animations[prevState.Name].action;

			curAction.reset();
			curAction.setLoop(THREE.LoopOnce, 1);
			curAction.clampWhenFinished = true;
			curAction.crossFadeFrom(prevAction, 0.1, true);
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
		const action = this._parent._proxy._animations[this._jumpType].action;
		action.getMixer().removeEventListener('finished', this._finishedCallback);
	}

	exit() {
		this._cleanup();
	}

	update() {
	}
};

class JumpStandState extends JumpState {
	constructor(parent) {
		super(parent, 'jumpStand');
	}
};

class JumpFwdState extends JumpState {
	constructor(parent) {
		super(parent, 'jumpFwd');
	}
};

class JumpBwdState extends JumpState {
	constructor(parent) {
		super(parent, 'jumpBwd');
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

			curAction.crossFadeFrom(prevAction, 0.2, true);
			curAction.play();
		} else {
			curAction.play();
		}
	}

	exit() {
	}

	update(timeElapsed, input) {
		if (input._keys.ctrl) {
			this._parent.setState('jumpFwd');
			return;
		}
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

			curAction.crossFadeFrom(prevAction, 0.2, true);
			curAction.play();
		} else {
			curAction.play();
		}
	}

	exit() {
	}

	update(timeElapsed, input) {
		if (input._keys.ctrl) {
			this._parent.setState('jumpBwd');
			return;
		}
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
			if (input._keys.ctrl) {
				this._parent.setState('jumpFwd');
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
			if (input._keys.ctrl) {
				this._parent.setState('jumpBwd');
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

class ActionRandomizer {
	constructor() {
		this._index;
	}
	getRandomIndex(actions) {
		if (!actions.length)
			return;
		this._index = Math.floor(Math.random() * actions.length);
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
		} else if (input._keys.ctrl) {
			this._parent.setState('jumpStand');
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
		//   console.log(name)
		//   console.log(this._states)
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

export class CharacterFSM extends FiniteStateMachine {
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
		this._addState('jumpStand', JumpStandState);
		this._addState('jumpBwd', JumpBwdState);
		this._addState('jumpFwd', JumpFwdState);
	}
};