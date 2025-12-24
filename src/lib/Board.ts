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

    /** Stores the hints for each row */
    private RowHints: number[][] = [];
    /** Stores the hints for each column */
    private ColHints: number[][] = [];

    /** Stores the length of the longest row hint */
    private longestRowHint: number = 0;
    /** Stores the length of the longest column hint */
    private longestColHint: number = 0;

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

    /** Sets the true value of a cell.
     * @param {number} row - The row number of the cell
     * @param {number} col - The column number of the cell
     * @param {number} value - The true value to set (0 = empty, 1 = filled)
     */
    setTrueValue(row: number, col: number, value: number): void {
        this.cells[this.index(row, col)] = (this.cells[this.index(row, col)] & 0b110) | (value & 0b001);
    }

    /** Sets the marked status of a cell.
     * @param {number} row - The row number of the cell
     * @param {number} col - The column number of the cell
     * @param {boolean} marked - The marked status to set (true = marked, false = unmarked)
     */
    setMarked(row: number, col: number, marked: boolean): void {
        this.cells[this.index(row, col)] = marked
            ? (this.cells[this.index(row, col)] | 0b010)
            : (this.cells[this.index(row, col)] & 0b101);
    }

    /** Sets the revealed status of a cell.
     * @param {number} row - The row number of the cell
     * @param {number} col - The column number of the cell
     * @param {boolean} revealed - The revealed status to set (true = revealed, false = unrevealed)
     */
    setRevealed(row: number, col: number, revealed: boolean): void {
        this.cells[this.index(row, col)] = revealed
            ? (this.cells[this.index(row, col)] | 0b100)
            : (this.cells[this.index(row, col)] & 0b011);
    }

    /** Calculates the hints for each row and column based on the current true values of the cells */
    calculateHints(): void {
        // Reset the row and column hints to arrays (length row, column respectively) of empty arrays
        this.RowHints = Array(this.rows).fill(null).map(() => []);
        this.ColHints = Array(this.cols).fill(null).map(() => []);

        // Reset the stored longest hints
        this.longestRowHint = 0;
        this.longestColHint = 0;

        // Temporary array to track current column hints
        const currentColHints: number[] = Array(this.cols).fill(0);

        // Loop through all the rows and columns to calculate hints
        for (let r = 0; r < this.rows; r++) {
            // On new row, reset the size of the current hint
            let currentRowHint = 0;
            // Loop through every column in this row
            for (let c = 0; c < this.cols; c++) {
                const isFilled = this.getTrueValue(r, c) === 1;
                if (isFilled) {
                    // If the current cell is filled, increment the current hint size for this row
                    currentRowHint++;
                } else {
                    // If the current cell is empty, store the current row hint (if any) and reset it
                    if (currentRowHint > 0) {
                        this.RowHints[r].push(currentRowHint);
                        currentRowHint = 0;
                    }
                }

                if (isFilled) {
                    // If the current cell is filled, increment the current hint size for this column
                    currentColHints[c]++;
                } else {
                    // If the current cell is empty, store the current column hint (if any) and reset it
                    if (currentColHints[c] > 0) {
                        this.ColHints[c].push(currentColHints[c]);
                        currentColHints[c] = 0;
                    }
                }
            }

            // At the end of the row, store the remaining hint if present
            if (currentRowHint > 0) {
                this.RowHints[r].push(currentRowHint);
            }

            // Compare the current row hint length to the longest row hint, overwriting if larger
            if (this.RowHints[r].length > this.longestRowHint) {
                this.longestRowHint = this.RowHints[r].length;
            }
        }

        for (let c = 0; c < this.cols; c++) {
            // At the end, loop through all the columns and push any outstanding hints
            if (currentColHints[c] > 0) {
                this.ColHints[c].push(currentColHints[c]);
            }
            // Compare the current column hint length to the longest column hint, overwriting if larger
            if (this.ColHints[c].length > this.longestColHint) {
                this.longestColHint = this.ColHints[c].length; 
            }
        }
    }
}