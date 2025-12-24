/**
 * Class representing a grid of cells for the game Picross
 * 
 * Each cells uses three bits:
 *  - Bit 0: the filled value of the cell (0 = empty, 1 = filled)
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
    public isFilled(row: number, col: number): boolean {
        return (this.cells[this.index(row, col)] & 0b001) !== 0;
    }

    /** Returns the marked status of the specified cell (true = marked, false = unmarked) */
    public isMarked(row: number, col: number): boolean {
        return (this.cells[this.index(row, col)] & 0b010) !== 0;
    }

    /** Returns the revealed status of the specified cell (true = revealed, false = unrevealed) */
    public isRevealed(row: number, col: number): boolean {
        return (this.cells[this.index(row, col)] & 0b100) !== 0;
    }

    /** Returns the array of hints for the specified row */
    public getRowHints(row: number): number[] {
        return this.RowHints[row];
    }

    /** Returns the array of hints for the specified column */
    public getColHints(col: number): number[] {
        return this.ColHints[col];
    }

    /** Returns the length of the longest row hint */
    public getLongestRowHintLength(): number {
        return this.longestRowHint;
    }

    /** Returns the length of the longest column hint */
    public getLongestColHintLength(): number {
        return this.longestColHint;
    }

    /** Sets the filled value of a cell.
     * @param {number} row - The row number of the cell
     * @param {number} col - The column number of the cell
     * @param {number} value - The true value to set (0 = empty, 1 = filled)
     */
    public fillCell(row: number, col: number, filled: boolean): void {
        this.cells[this.index(row, col)] = (this.cells[this.index(row, col)] & 0b110) | (filled ? 1 : 0);
    }

    /** Sets the marked status of a cell.
     * @param {number} row - The row number of the cell
     * @param {number} col - The column number of the cell
     * @param {boolean} marked - The marked status to set (true = marked, false = unmarked)
     */
    public markCell(row: number, col: number, marked: boolean): void {
        this.cells[this.index(row, col)] = marked
            ? (this.cells[this.index(row, col)] | 0b010)
            : (this.cells[this.index(row, col)] & 0b101);
    }

    /** Sets the revealed status of a cell.
     * @param {number} row - The row number of the cell
     * @param {number} col - The column number of the cell
     * @param {boolean} revealed - The revealed status to set (true = revealed, false = unrevealed)
     */
    public revealCell(row: number, col: number, revealed: boolean): void {
        this.cells[this.index(row, col)] = revealed
            ? (this.cells[this.index(row, col)] | 0b100)
            : (this.cells[this.index(row, col)] & 0b011);
    }

    /** Calculates the hints for each row and column based on the current true values of the cells */
    public calculateHints(): void {
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
                const isFilled = this.isFilled(r, c);
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

    /**
     * Returns a string representation of the board, including hints.
     * Revealed cells show as "⏹" if filled, "⊡" if empty.
     * Unrevealed cells show as "⊠" if marked, "▢" if unmarked.
     * @param {boolean} admin False by default. If true, reveals all cells regardless of their revealed status
     * @returns 
     */
    public toString(admin:boolean = false): String {
        // An array of strings to be combined into the final string representation
        let lines: String[] = [];

        // An empty line holder 
        let line: String;

        // Start with constructing the column hints
        for (let i = 0; i < this.longestColHint; i++) {
            // Before any hints, add spacing to accommodate the row hints (added later)
            line = " ".repeat(this.longestRowHint * 2 + 1);
            // Loop through each column to add the appropriate hint or space
            for (let c = 0; c < this.cols; c++) {
                const hints = this.ColHints[c];
                // If there is a hint at this level, add it, otherwise add spaces
                if (hints.length + i >= this.longestColHint) {
                    line += hints[i - (this.longestColHint - hints.length)].toString() + " " + (" ".repeat(c % 4 === 0 ? 0 : 1));
                } else {
                    line += "  ";
                }
            }
            lines.push(line);
        }

        // Construct each row with hints followed by cell representations
        for (let r = 0; r < this.rows; r++) {
            line = "";
            // Add the row hints first
            const hints = this.RowHints[r];
            for (let i = 0; i < this.longestRowHint; i++) {
                if (hints.length + i >= this.longestRowHint) {
                    line += hints[i - (this.longestRowHint - hints.length)].toString() + " ";
                } else {
                    line += "  ";
                }
            }
            line += "|";
            // Now add the cell representations
            for (let c = 0; c < this.cols; c++) {
                line += this.getStringForCell(r, c, admin) + "|";
            }
            lines.push(line);
        }
        return lines.join("\n");
    }

    /** Returns a string representation of the cell based on its state.
     * A revealed cell will show as "⏹" if filled, "⊡" if empty.
     * An unrevealed cell will show as "⊠" if marked, "▢" if unmarked.
     * @param {number} row - The row number of the cell
     * @param {number} col - The column number of the cell
     * @param {boolean} admin - If true, reveals all cells regardless of their revealed status
     * @returns A string representing the cell's state
     */
    private getStringForCell(row: number, col: number, admin: boolean = false): String {
        if(this.isRevealed(row, col) || admin) {
            return this.isFilled(row, col) ? "⏹" : "⊡";
        } else {
            return this.isMarked(row, col) ? "⊠" : "▢";
        }
    }
}