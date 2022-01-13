import { BoardMap, FEN, shiftChar } from '../../utils/utils';
import { Color, Piece } from './Piece';

interface CheckStatus {
    check: boolean,
    piece: string | null,
}

export default class King extends Piece {
    canCastleShort: boolean;
    canCastleLong: boolean;
    isInCheck = false;
    checkBy: string | null = null;

    constructor(color: Color, position: string, castlingAvailability: string) {
        super(color, position, 'King', 'consecutive');
        this.canCastleShort = (castlingAvailability.includes('K') && color === 'light') ||
            (castlingAvailability.includes('k') && color === 'dark');
        this.canCastleLong = (castlingAvailability.includes('Q') && color === 'light') ||
            (castlingAvailability.includes('q') && color === 'dark');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
            // Up
            this.legalMoves.push(`${shiftChar(this.file, -1)}-${this.rank + 1}`);
            this.legalMoves.push(`${this.file}-${this.rank + 1}`);
            this.legalMoves.push(`${shiftChar(this.file, 1)}-${this.rank + 1}`);
            // Down
            this.legalMoves.push(`${shiftChar(this.file, -1)}-${this.rank - 1}`);
            this.legalMoves.push(`${this.file}-${this.rank - 1}`);
            this.legalMoves.push(`${shiftChar(this.file, 1)}-${this.rank - 1}`);
            // Left
            this.legalMoves.push(`${shiftChar(this.file, -1)}-${this.rank}`);
            // Right
            this.legalMoves.push(`${shiftChar(this.file, 1)}-${this.rank}`);
            this.legalMoves = this.filterValidMoves(this.legalMoves, currentBoard);
            if (this.canCastleShort && this.canPerformCastleShort(currentBoard)) {
                const castleShortPosition = this.color === 'light' ? 'g-1' : 'g-8';
                this.legalMoves.push(castleShortPosition);
            }
            if (this.canCastleLong && this.canPerformCastleLong(currentBoard)) {
                const castleLongPosition = this.color === 'light' ? 'c-1' : 'c-8';
                this.legalMoves.push(castleLongPosition);
            }
        }
        return this.legalMoves;
    }

    public canPerformCastleShort(currentBoard: BoardMap): boolean {
        return currentBoard[`${shiftChar(this.file, 1)}-${this.rank}`] === 'x' && currentBoard[`${shiftChar(this.file, 2)}-${this.rank}`] === 'x';
    }

    public canPerformCastleLong(currentBoard: BoardMap): boolean {
        return currentBoard[`${shiftChar(this.file, -1)}-${this.rank}`] === 'x' && currentBoard[`${shiftChar(this.file, -2)}-${this.rank}`] === 'x' && currentBoard[`${shiftChar(this.file, -3)}-${this.rank}`] === 'x';
    }

    public findAttackersFromPositions(positions: string[], boardMap: BoardMap, attackingPieceCode: string): boolean {
        const boardKeys = Object.keys(boardMap);
        positions = positions.filter((position) => boardKeys.includes(position));
        const attackers = positions.filter((position) => boardMap[position] === attackingPieceCode);
        // Theoretically there can only be one attacker at a time
        if (attackers.length > 0) {
            this.isInCheck = true;
            this.checkBy = attackers[0];
            return true;
        }
        return false;
    }

    // TODO: Refactor this to only require currentBoard
    public getCheckStatus(currentBoard: BoardMap): CheckStatus {
        const boardKeys = Object.keys(currentBoard); // TODO: Make this static array in utils
        let direction: number;
        let aKnight: string;
        let aPawn: string;
        let aQueen: string;
        let aRook: string;
        let aBishop: string;
        if (this.color === 'light') {
            direction = 1;
            aKnight = 'n';
            aPawn = 'p';
            aQueen = 'q';
            aRook = 'r';
            aBishop = 'b';
        }
        else {
            direction = -1;
            aKnight = 'N';
            aPawn = 'P';
            aQueen = 'Q';
            aRook = 'R';
            aBishop = 'B';
        }
        // Check for attacking knights
        const possibleKnightPositions = [
            `${shiftChar(this.file, 1)}-${this.rank + 2}`,
            `${shiftChar(this.file, -1)}-${this.rank + 2}`,
            `${shiftChar(this.file, 2)}-${this.rank + 1}`,
            `${shiftChar(this.file, -2)}-${this.rank + 1}`,
            `${shiftChar(this.file, 2)}-${this.rank - 1}`,
            `${shiftChar(this.file, -2)}-${this.rank - 1}`,
            `${shiftChar(this.file, 1)}-${this.rank - 2}`,
            `${shiftChar(this.file, -1)}-${this.rank - 2}`,
        ];
        // If no attacking knights
        if (!this.findAttackersFromPositions(possibleKnightPositions, currentBoard, aKnight)) {
            // Check for attacking pawn
            const possiblePawnPositions = [
                `${shiftChar(this.file, 1)}-${this.rank + direction}`,
                `${shiftChar(this.file, -1)}-${this.rank + direction}`,
            ];
            // If no attacking pawns
            if (!this.findAttackersFromPositions(possiblePawnPositions, currentBoard, aPawn)) {
                // Check for attacking rooks or queens
                const possibleRookQueenPositions = [];
                // Look up
                for (let i = this.rank + 1; i <= 8; i++) {
                    const newPosition = `${this.file}-${i}`;
                    if (!(currentBoard[newPosition] === 'x')) {
                        if (currentBoard[newPosition] === aQueen || currentBoard[newPosition] === aRook) {
                            this.isInCheck = true;
                            this.checkBy = newPosition;
                            return { check: this.isInCheck, piece: this.checkBy };
                        }
                        else {
                            break;
                        }
                    }
                }
                // Look down
                for (let i = this.rank - 1; i >= 1; i--) {
                    const newPosition = `${this.file}-${i}`;
                    if (!(currentBoard[newPosition] === 'x')) {
                        if (currentBoard[newPosition] === aQueen || currentBoard[newPosition] === aRook) {
                            this.isInCheck = true;
                            this.checkBy = newPosition;
                            return { check: this.isInCheck, piece: this.checkBy };
                        }
                        else {
                            break;
                        }
                    }
                }
                // Look left
                for (let i = this.file.charCodeAt(0) - 1; i <= 'a'.charCodeAt(0); i--) {
                    const newPosition = `${String.fromCharCode(i)}-${this.rank}`;
                    if (!(currentBoard[newPosition] === 'x')) {
                        if (currentBoard[newPosition] === aQueen || currentBoard[newPosition] === aRook) {
                            this.isInCheck = true;
                            this.checkBy = newPosition;
                            return { check: this.isInCheck, piece: this.checkBy };
                        }
                        else {
                            break;
                        }
                    }
                }
                // Look right
                for (let i = this.file.charCodeAt(0) + 1; i >= 'h'.charCodeAt(0); i++) {
                    const newPosition = `${String.fromCharCode(i)}-${this.rank}`;
                    if (!(currentBoard[newPosition] === 'x')) {
                        if (currentBoard[newPosition] === aQueen || currentBoard[newPosition] === aRook) {
                            this.isInCheck = true;
                            this.checkBy = newPosition;
                            return { check: this.isInCheck, piece: this.checkBy };
                        }
                        else {
                            break;
                        }
                    }
                }
                // If no attacking rooks or queens
                // Look up-left
                // Look up-right
                // Look down-left
                // Look down-right
            }
        }
        // Check for attacking Bishop/Queen/pawn

        return { check: this.isInCheck, piece: this.checkBy };
    }
}
