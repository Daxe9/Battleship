import type {Cell} from '../types/interfaces';

class GameRuler {
    public boardPlayer1: Array<Array<Cell>>;
    public boardPlayer2: Array<Array<Cell>>;

    // down right up left
    private readonly directions: Array<Array<number>> = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ];
    private readonly neighbours: Array<Array<number>> = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ];

    /**
     * Given coordinates return if the coordinates are near the border
     * @param x, x coord
     * @param y, y coord
     * @param board, check the coordinates on a specific board
     * @return boolean, true if the coordinates are near the border
     * @private
     */
    private nearBorder(x: number, y: number, board: Array<Array<Cell>>): boolean {
        if (board.length !== board[0].length) {
            throw new Error("The board must be a square");
        }
        const size = board.length;
        return x < 1 || x > size - 2 || y < 1 || y > size - 2
    }

    /**
     * @return boolean: true if there are no ship around the given coordinates
     * */
    private controlNeighbour(x: number, y: number, board: Array<Array<Cell>>): boolean {
        for (let i = 0; i < this.neighbours.length; i++) {
            try {
                if (board[x + this.neighbours[i][0]][y + this.neighbours[i][1]].isShip) {
                    return false
                }
            } catch (e: any) {
            }
        }
        return true;
    }

    constructor() {
        this.boardPlayer1 = this.createBoard(10);
        this.boardPlayer2 = this.createBoard(10);
        this.randomizeBoard([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);
    }

    /**
     * Create a new game board
     * @param size: the size of the board
     * @return matrix: a 2d array of Cell with given size
     * */
    public createBoard(size: number): Array<Array<Cell>> {
        const matrix: Array<Array<Cell>> = [];
        for (let i = 0; i < size; i++) {
            const temp: Array<Cell> = [];
            for (let j = 0; j < size; j++) {
                temp.push({visible: false, isShip: false})
            }
            matrix.push(temp);
        }
        return matrix;
    }

    /**
     * places ships based on the given array of sizes
     * @param ships, an array of ship' sizes
     * @private
     */
    private randomizeBoard(ships: Array<number>): void {
        for (let i = 0; i < ships.length; i++) {
            // first player's board
            let coords = this.createShip(ships[i], this.boardPlayer1);
            for (let j = 0; j < coords.length; j++) {
                this.boardPlayer1[coords[j][0]][coords[j][1]].isShip = true;
            }

            // second player's board
            coords = this.createShip(ships[i], this.boardPlayer2);
            for (let j = 0; j < coords.length; j++) {
                this.boardPlayer2[coords[j][0]][coords[j][1]].isShip = true;
            }
        }
    }

    /**
     *
     * @param size, the size of the ship
     * @param board, the game board
     * @return coords: an array of coordinates of the ship
     */
    private createShip(size: number, board: Array<Array<Cell>>): Array<Array<number>> {
        // create an array of coordinates of cell whose are ship
        const coords: Array<Array<number>> = [];

        // get a random coordinates that's not near the border
        let x: number;
        let y: number;

        const xNumbersPool: Array<number> = [...Array(board.length).keys()]
        const yNumbersPool: Array<number> = [...Array(board.length).keys()]

        do {

            x = Math.floor(Math.random() * xNumbersPool.length);

            y = Math.floor(Math.random() * yNumbersPool.length);


            xNumbersPool.splice(xNumbersPool.indexOf(x), 1);
            yNumbersPool.splice(xNumbersPool.indexOf(y), 1);
            console.log("here")
        } while (
            board[x][y].isShip ||
            this.nearBorder(x, y, board) ||
            !this.controlNeighbour(x, y, board));
        coords.push([x, y]);

        
        // search other available spot for ship
        let controlledIndex: number = 0;


        for (let direction = 0; direction < this.directions.length; ++direction) {
            // try to find a spot for the ship
            try {
                const newX = coords[controlledIndex][0] + this.directions[direction][0];
                const newY = coords[controlledIndex][1] + this.directions[direction][1];
                if (this.controlNeighbour(newX, newY, board)) {
                    coords.push([newX, newY]);
                }
            } catch (e: any) {
            }

            // if there are enough coordinates for the size of the ship, return the coordinates
            if (coords.length === size) {
                break;
            }

            // if after exploring all directions, there are not enough coordinates,
            // start explore the directions of the next pair of the coordinates
            if (direction === 3 && coords.length < size && coords.length > 1) {
                direction = 0;
                controlledIndex += 1;
            }

        }
        return coords;
    }
}

const temp = new GameRuler()

export default GameRuler;