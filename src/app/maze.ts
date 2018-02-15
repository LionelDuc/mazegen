import { Tile } from './tile';

export class Maze {
	tiles: Array<Tile>;

	constructor() {
		this.tiles = new Array();
	}

	public byPosition(x: number, y: number) {
		return this.tiles.find((tile: Tile) => tile.x === x && tile.y === y);
	}
}