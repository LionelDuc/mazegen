import { Maze } from './maze';

export enum WALL {
	NORTH = 1,
	EAST = 2,
	SOUTH = 4,
	WEST = 8
}

export class Tile {
	x: number;
	y: number;
	walls: number;
	visited: boolean;
	neighbours: Array<any>;

	constructor(x: number, y: number, walls?: number) {
		this.x = x;
		this.y = y;
		this.walls = walls || 15;
		this.visited = false;
		this.neighbours = [{
			x: -1,
			y: 0,
		}, {
			x: 0,
			y: 1
		}, {
			x: 0,
			y: -1
		}, {
			x: 1,
			y: 0
		}];
	}

	public discoverNeighbours(maze: Maze) {
		let results = new Array();
		for (let i = 0; i < this.neighbours.length; ++i) {
			let pos = this.neighbours[i];
			let tile = maze.byPosition(this.x + pos.x, this.y + pos.y);
			if (tile && !tile.visited) {
				results.push(tile);
			}
		}
		return results;
	}

	public removeWall(tile: Tile) {
		if (this.x < tile.x) {
			this.walls -= WALL.EAST;
		} else if (this.x > tile.x) {
			this.walls -= WALL.WEST;
		} else if (this.y < tile.y) {
			this.walls -= WALL.SOUTH;
		} else if (this.y > tile.y) {
			this.walls -= WALL.NORTH;
		}
	}

	public equals(tile: Tile) {
		return this.x === tile.x && this.y === tile.y;
	}

	public hasWall(wall: WALL) {
		return (this.walls & wall) === wall;
	}
}