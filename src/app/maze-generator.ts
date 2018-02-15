import { Maze } from './maze';
import { Tile } from './tile';

export class MazeGenerator {

	static generate(width: number, height: number, initial: {x?: number, y?:number} = {}): Maze {
		let debugIt = 0;
		let maze = new Maze();
		for (let i = 0; i < width; ++i) {
			for (let j = 0; j < height; ++j) {
				maze.tiles.push(new Tile(i, j));
			}
		}
		let current = maze.byPosition(initial.x || 0, initial.y || 0);
		current.visited = true;
		let stack = new Array<Tile>();
		// console.log('Starting generation');
		while (maze.tiles.filter((tile) => !tile.visited).length > 0) {
			// console.log('While unvisited count : %s', maze.tiles.filter((tile) => !tile.visited).length);
			let neighbours = current.discoverNeighbours(maze);
			// console.log('Discovered %s neighbours', neighbours.length);
			if (neighbours.length > 0) {
				let next = neighbours[Math.floor(Math.random() * (neighbours.length))];
				// console.log('next:%s,%s', next.x, next.y);
				current.removeWall(next);
				next.removeWall(current);
				stack.push(current);
				current = next;
				current.visited = true;
			} else if (stack.length > 0) {
				current = stack.shift();
				// console.log('Stack pop:%s,%s', current.x, current.y);
			} else {
				break;
			}
		}
		return maze;
	}
}