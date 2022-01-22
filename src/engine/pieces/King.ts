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
            let moves = [];
            // Up
            moves.push(`${shiftChar(this.file, -1)}-${this.rank + 1}`);
            moves.push(`${this.file}-${this.rank + 1}`);
            moves.push(`${shiftChar(this.file, 1)}-${this.rank + 1}`);
            // Down
            moves.push(`${shiftChar(this.file, -1)}-${this.rank - 1}`);
            moves.push(`${this.file}-${this.rank - 1}`);
            moves.push(`${shiftChar(this.file, 1)}-${this.rank - 1}`);
            // Left
            moves.push(`${shiftChar(this.file, -1)}-${this.rank}`);
            // Right
            moves.push(`${shiftChar(this.file, 1)}-${this.rank}`);
            moves = this.filterValidMoves(moves, currentBoard);
            for (const move of moves) {
                if (this.checkCastlingForAttackers([move], currentBoard) === 1) {
                    this.legalMoves.push(move);
                }
            }
            if (this.canCastleShort && this.canPerformCastleShort(currentBoard)) {
                const checkPositions = [`${shiftChar(this.file, 1)}-${this.rank}`, `${shiftChar(this.file, 2)}-${this.rank}`];
                const good = this.checkCastlingForAttackers(checkPositions, currentBoard);
                if (good === 2) {
                    const castleShortPosition = this.color === 'light' ? 'g-1' : 'g-8';
                    this.legalMoves.push(castleShortPosition);
                }
            }
            if (this.canCastleLong && this.canPerformCastleLong(currentBoard)) {
                const checkPositions = [`${shiftChar(this.file, -1)}-${this.rank}`, `${shiftChar(this.file, -2)}-${this.rank}`];
                const good = this.checkCastlingForAttackers(checkPositions, currentBoard);
                if (good === 2) {
                    const castleLongPosition = this.color === 'light' ? 'c-1' : 'c-8';
                    this.legalMoves.push(castleLongPosition);
                }
            }
        }
        return this.legalMoves;
    }

    public checkCastlingForAttackers(positions: string[], currentBoard: BoardMap): number {
        const currentCheckStatus = this.checkBy;
        const currentInCheck = this.isInCheck;
        const currentPosition = this.position;
        const currentRank = this.rank;
        const currentFile = this.file;
        let good = 0;
        for (const pos of positions) {
            const boardCopy = JSON.parse(JSON.stringify(currentBoard));
            boardCopy[this.position] = 'x';
            boardCopy[pos] = this.code;
            this.position = pos;
            this.rank = Number(pos[2]);
            this.file = pos[0];
            const checkStatus = this.getCheckStatus(boardCopy);
            if (!checkStatus.check) {
                good += 1;
            }
            this.checkBy = currentCheckStatus;
            this.isInCheck = currentInCheck;
        }
        this.position = currentPosition;
        this.rank = currentRank;
        this.file = currentFile;
        return good;
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
                        const newPosition = `${shiftChar(this.file, i)}-${this.rank - i}`;
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
