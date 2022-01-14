import { BoardMap, FEN, shiftChar, rankAndFile } from '../../utils/utils';
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
        positions = positions.filter((position) => rankAndFile.includes(position));
        const attackers = positions.filter((position) => boardMap[position] === attackingPieceCode);
        // Theoretically there can only be one attacker at a time
        if (attackers.length > 0) {
            this.isInCheck = true;
            this.checkBy = attackers[0];
            return true;
        }
        return false;
    }

    public checkDirection(currentBoard: BoardMap, position: string, piece1: string, piece2: string): boolean {
        if (rankAndFile.includes(position)) {
            if (currentBoard[position] === 'x') {
                return true;
            }
            else if (currentBoard[position] === piece1 || currentBoard[position] === piece2) {
                this.isInCheck = true;
                this.checkBy = position;
                return false;
            }
        }
        return false;
    }

    public getCheckStatus(currentBoard: BoardMap): CheckStatus {
        this.isInCheck = false;
        this.checkBy = null;
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
                let up = true;
                let down = true;
                let left = true;
                let right = true;
                let upLeft = true;
                let upRight = true;
                let downLeft = true;
                let downRight = true;
                for (let i = 1; i <= 8; i++) {
                    if (up) {
                        const newPosition = `${this.file}-${this.rank + i}`;
                        up = this.checkDirection(currentBoard, newPosition, aQueen, aRook);
                    }
                    if (down) {
                        const newPosition = `${this.file}-${this.rank - i}`;
                        down = this.checkDirection(currentBoard, newPosition, aQueen, aRook);
                    }
                    if (left) {
                        const newPosition = `${shiftChar(this.file, -i)}-${this.rank}`;
                        left = this.checkDirection(currentBoard, newPosition, aQueen, aRook);
                    }
                    if (right) {
                        const newPosition = `${shiftChar(this.file, i)}-${this.rank}`;
                        right = this.checkDirection(currentBoard, newPosition, aQueen, aRook);
                    }
                    if (upLeft) {
                        const newPosition = `${shiftChar(this.file, -i)}-${this.rank + i}`;
                        upLeft = this.checkDirection(currentBoard, newPosition, aQueen, aBishop);
                    }
                    if (upRight) {
                        const newPosition = `${shiftChar(this.file, i)}-${this.rank + i}`;
                        upRight = this.checkDirection(currentBoard, newPosition, aQueen, aBishop);
                    }
                    if (downLeft) {
                        const newPosition = `${shiftChar(this.file, -i)}-${this.rank - i}`;
                        downLeft = this.checkDirection(currentBoard, newPosition, aQueen, aBishop);
                    }
                    if (downRight) {
                        const newPosition = `${shiftChar(this.file, i)}-${this.rank + i}`;
                        downRight = this.checkDirection(currentBoard, newPosition, aQueen, aBishop);
                    }
                    if ((!up && !down && !left && !right && !upLeft && !upRight && !downLeft && !downRight) || (this.isInCheck)) {
                        break;
                    }
                }
            }
        }

        return { check: this.isInCheck, piece: this.checkBy };
    }
}
