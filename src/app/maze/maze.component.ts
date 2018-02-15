import { Component, OnInit, Input } from '@angular/core';

import * as PIXI from 'pixi.js';
import * as planck from 'planck-js';

import { EngineService, InstanceService, TgInstance, STATE } from '@trilliangular/core';

import { WALL, Tile } from '../tile';
import { Maze } from '../maze';
import { MazeGenerator } from '../maze-generator';
import { PhysicsService } from '../physics.service';

@Component({
	selector: 'mg-maze',
	templateUrl: './maze.component.html',
	styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit {
	@Input() id: string | number;
	@Input() width: number;
	@Input() height: number;
	@Input() tileWidth: number;
	@Input() tileHeight: number;
	tileMap: PIXI.tilemap.CompositeRectTileLayer;
	textures: Array<PIXI.Texture>;
	maze: Maze;

	constructor(private engineService: EngineService,
		private instanceService: InstanceService,
		private physicsService: PhysicsService) {
		this.id = 'maze';
		this.textures = [
			PIXI.Texture.fromImage('/assets/ground_0.png'),
			PIXI.Texture.fromImage('/assets/wall_1.png'),
			PIXI.Texture.fromImage('/assets/wall_2.png'),
			PIXI.Texture.fromImage('/assets/wall_4.png'),
			PIXI.Texture.fromImage('/assets/wall_8.png')
		];
	}

	ngOnInit() {
		this.maze = MazeGenerator.generate(this.width, this.height); 
		let thickness = 20;
		this.tileMap = new PIXI.tilemap.CompositeRectTileLayer(0, this.textures, this.tileWidth === this.tileHeight);
		this.tileMap.width = this.width * this.tileWidth;
		this.tileMap.height = this.height * this.tileHeight;
		let idPrefix = this.id + '_wall_';
		this.instanceService.getInstance(this.id, STATE.LOADED).delay(500).subscribe(() => {
			for (let i = 0; i < this.width; ++i) {
				for (let j = 0; j < this.height; ++j) {
					this.tileMap.addFrame(this.textures[0], i * this.tileWidth, j * this.tileHeight, 0, 0);
					let tile = this.maze.byPosition(i, j);
					let tilePrefix = idPrefix + tile.x + '_' + tile.y + '_';
					let x = i * this.tileWidth;
					let y = j * this.tileHeight;
					if (tile.hasWall(WALL.NORTH)) {
						this.tileMap.addFrame(this.textures[1], x, y, 0, 0);
						this.addWall(tilePrefix + 'NORTH', x, y, this.tileWidth, thickness);
					}
					if (tile.hasWall(WALL.SOUTH)) {
						this.tileMap.addFrame(this.textures[3], x, y + this.tileHeight - thickness, 0, 0);
						this.addWall(tilePrefix + 'SOUTH', x, y + this.tileHeight - thickness, this.tileWidth, thickness);
					}
					if (tile.hasWall(WALL.EAST)) {
						this.tileMap.addFrame(this.textures[2], x + this.tileWidth - thickness, y, 0, 0);
						this.addWall(tilePrefix + 'EAST', x + this.tileWidth - thickness, y, thickness, this.tileHeight);
					}
					if (tile.hasWall(WALL.WEST)) {
						this.tileMap.addFrame(this.textures[4], x, y, 0, 0);
						this.addWall(tilePrefix + 'WEST', x, y, thickness, this.tileHeight);
					}
				}
			}
		});
		this.engineService.deltaUpdates.subscribe((delta) => {
			let player = this.physicsService.getBody('player');
			let renderer = this.engineService.engine.renderer;
			this.tileMap.position.x = renderer.width / 2 - player.getPosition().x;
			this.tileMap.position.y = renderer.height / 2 - player.getPosition().y;
		});
	}

	private addWall(id: string, x: number, y: number, width: number, height: number) {
		let body = this.physicsService.world.createBody({
			position: planck.Vec2(x + width / 2, y + height / 2),
			userData: {
				id: id
			}
		});
		body.createFixture(new planck.Box(width / 2, height / 2), {
			friction: 0.3,
    		restitution: 0,
    		density: 1
		});
	}

}
