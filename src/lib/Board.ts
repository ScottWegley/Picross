/**
 * Class representing a grid of cells for the game Picross
 * 
 * Each cells uses three bits:
 *  - Bit 0: the true value of the cell (0 = empty, 1 = filled)
 *  - Bit 1: whether the cell has been marked (0 = unmarked, 1 = marked)
 *  - Bit 2: whether the cell has been revealed (0 = unrevealed, 1 = revealed)
 */
export class Board {
    /** The number of rows in the board */
    readonly rows: number;
    /** The number of columns in the board */
    readonly cols: number;
    /** An array storing each cell in the Picross board as an {@link Uint8Array}.  Only three bits are used currently
     * (see class description for details).
     */
    private cells: Uint8Array;

    /**
     * Creates a new instance of {@link Board}
     * @param {number} rows - The number of rows in the board
     * @param {number} cols - The number of columns in the board
     */
    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.cells = new Uint8Array(rows * cols);
    }

    /**
     * Internal function used to compute the index of a cell in the {@link cells} array
     * @param row The row number of the cell
     * @param col The column number of the cell
     * @returns The index of the cell in the {@link cells} array
     */
    private index(row: number, col: number): number {
        return row * this.cols + col;
    }

    /** Returns the true value of the specified cell (0 = empty, 1 = filled) */
    getTrueValue(row: number, col: number): number {
        return (this.cells[this.index(row, col)] & 0b001) !== 0 ? 1 : 0;
    }

    /** Returns the marked status of the specified cell (true = marked, false = unmarked) */
    isMarked(row: number, col: number): boolean {
        return (this.cells[this.index(row, col)] & 0b010) !== 0;
    }

    /** Returns the revealed status of the specified cell (true = revealed, false = unrevealed) */
    isRevealed(row: number, col: number): boolean {
        return (this.cells[this.index(row, col)] & 0b100) !== 0;
    }
}