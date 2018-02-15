import { Component, OnInit, Input, HostListener } from '@angular/core';

import { EngineService } from '@trilliangular/core';

import * as PIXI from 'pixi.js';
import * as planck from 'planck-js';

import { PhysicsService } from '../physics.service';

@Component({
	selector: 'mg-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
	@Input() id: string | number;
	@Input() textureUrl: string;
	sprite: PIXI.Sprite;
	velocity: number;
	keys: any;

	constructor(private engineService: EngineService,
		private physicsService: PhysicsService) {
		this.id = 'player';
		this.textureUrl = '/assets/link.png';
		this.velocity = 10;
		this.keys = {
			up: false,
			right: false,
			down: false,
			left: false
		};
	}

	ngOnInit() {
		this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage(this.textureUrl));
		this.sprite.scale.set(0.3, 0.3);
		this.sprite.anchor.set(0.5, 0.5);
		let body = this.physicsService.world.createDynamicBody({
			position: planck.Vec2(125, 125),
			userData: {
				id: this.id
			}
		});
		body.createFixture(new planck.Circle(128 * 0.3), {
			friction: 0.1,
    		restitution: 0,
    		density: 20
		});
		this.engineService.deltaUpdates.take(1).subscribe((delta) => {
			let renderer = this.engineService.engine.renderer;
			this.sprite.position.set(renderer.instance.width / 2, renderer.instance.height / 2);
		});
		this.engineService.deltaUpdates.subscribe((delta) => {
			let step = delta * this.velocity;
			let playerVel = body.getLinearVelocity();
			let desiredVel = new planck.Vec2();
			if (this.keys.up) {
				desiredVel.y = -step;
			}
			if (this.keys.down) {
				desiredVel.y = step;
			}
			if (this.keys.left) {
				desiredVel.x = -step;
			}
			if (this.keys.right) {
				desiredVel.x = step;
			}
			if (desiredVel.x !== 0 || desiredVel.y !== 0) {
				let velChange = new planck.Vec2(desiredVel.x - playerVel.x, desiredVel.y - playerVel.y);
	    		let impulse = new planck.Vec2(body.getMass() * velChange.x, body.getMass() * velChange.y);
				body.applyLinearImpulse(impulse, body.getWorldCenter(), true);
			} else {
				let vel = body.getLinearVelocity();
				body.setLinearVelocity(new planck.Vec2(vel.x * 0.3, vel.y * 0.3));
			}
		});
	}

	@HostListener('document:keydown', ['$event'])
	public keyDownHandler(event) {
		if (event.key === 'z') {
			this.keys.up = true;
		}
		if (event.key === 'd') {
			this.keys.right = true;
		}
		if (event.key === 's') {
			this.keys.down = true;
		}
		if (event.key === 'q') {
			this.keys.left = true;
		}
	}

	@HostListener('document:keyup', ['$event'])
	public keyUpHandler(event) {
		if (event.key === 'z') {
			this.keys.up = false;
		}
		if (event.key === 'd') {
			this.keys.right = false;
		}
		if (event.key === 's') {
			this.keys.down = false;
		}
		if (event.key === 'q') {
			this.keys.left = false;
		}
	}

}
