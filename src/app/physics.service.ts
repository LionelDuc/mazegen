import { Injectable } from '@angular/core';

import { Scheduler, Observable, Subject } from 'rxjs';

import * as planck from 'planck-js';

export type Collision = {
	fixtureA: planck.Body,
	fixtureB: planck.Body,
	position: planck.Vec2,
	normal: planck.Vec2,
	normalImpulse: any,
	tangentImpulse: any,
	separation: any
};

@Injectable()
export class PhysicsService {
	world: planck.World;
	collisions: Subject<Collision>;

	constructor() {
		this.world = new planck.World(new planck.Vec2(0, 0));
		let step = 1 / 60;
		Observable.interval(step).subscribe(() => {
			this.world.step(step);
		});
		this.collisions = new Subject();
		this.world.on('pre-solve', (contact, oldManifold) => {
			var manifold = contact.getManifold();
			var fixtureA = contact.getFixtureA();
			var fixtureB = contact.getFixtureB();
			var worldManifold = contact.getWorldManifold();

			for (var i = 0; i < manifold.pointCount; ++i) {
				var cp: Collision = {
					fixtureA: fixtureA,
					fixtureB: fixtureB,
					position: worldManifold.points[i],
					normal: worldManifold.normal,
					normalImpulse: manifold.points[i].normalImpulse,
					tangentImpulse: manifold.points[i].tangentImpulse,
					// state: state2[i],
					separation: worldManifold.separations[i]
				};
				this.collisions.next(cp);
			}
		});
		this.collisions.subscribe((collision: Collision) => {
			console.log('Collision between %s and %s', collision.fixtureA.getBody().getUserData().id, collision.fixtureB.getBody().getUserData().id);
		});
	}

	public getBody(id: string | number) {
		let result;
		for (var body = this.world.getBodyList(); body; body = body.getNext()) {
			if (body.getUserData().id === id) {
				result = body;
				break;
			}
		}
		return result;
	}

}
