import { Component, ViewChild } from '@angular/core';

import { ContainerDirective } from '@trilliangular/core';

import * as PIXI from 'pixi.js';

import { PhysicsService } from './physics.service';

@Component({
	selector: 'mg-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [
		PhysicsService
	]
})
export class AppComponent {
	@ViewChild('sceneC') sceneC: ContainerDirective;
	scene: PIXI.Container;
	private rotation: number;
	private position: PIXI.Point;
	private scale: PIXI.Point;

	constructor() {
		this.scene = new PIXI.Container();
		this.rotation = 0;
		this.position = new PIXI.Point(0, 100);
		this.scale = new PIXI.Point(0.25, 0.25);
	}

	ngAfterViewInit() {
		this.sceneC.self
			.mergeMap((scene) => scene.events.map((event) => [scene.instance, event]))
			.filter((value: any) => value[1].added)
			.map((value: any) => {
				value[1] = value[1].added.instance
				return value;
			})
			.subscribe((value: any) => {
				value[0].addChild(value[1]);
			});
	}
}
