import { BoardMap, FEN, shiftChar } from '../../utils/utils';

export type Color = 'light' | 'dark';

export type MoveType = 'consecutive' | 'jump';

export interface DefendPiece {
    code: string,
    position: string,
}

export abstract class Piece {
    name: string;
    code: string;
    color: Color;
    position: string;
    lastPosition: string | null;
    rank: number;
    file: string;
    legalMoves: string[] | null = null;
    moveType: MoveType;
    defending: DefendPiece[] = [];

    protected constructor(color: Color, position: string, name: string, moveType: MoveType) {
        this.color = color;
        this.position = position;
        this.lastPosition = null;
        this.name = name;
        this.code = this.parseCode();
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
        this.moveType = moveType;
    }

    public move(position: string): void {
        this.lastPosition = this.position;
        this.position = position;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        return [];
    }

    // Filters valid moves based on if the space exists and if the piece is either x or an enemy piece
    protected filterValidMoves(moves: string[], currentBoard: BoardMap): string[] {
        return moves.filter(move => this.isValidMovePosition(move, currentBoard));
    }

    protected isValidMovePosition(move: string, currentBoard: BoardMap): boolean {
        const lowerRangeEnemyCodes = this.color === 'dark' ? 65 : 97;
        const upperRangeEnemyCodes = this.color === 'dark' ? 90 : 122;
        const lowerRangeAllyCodes = this.color === 'dark' ? 97 : 65;
        const upperRangeAllyCodes = this.color === 'dark' ? 122 : 90;
        if (currentBoard[move]) {
            const moveCharCode = currentBoard[move].charCodeAt(0);
            if (currentBoard[move] === 'x') {
                return true;
            }
            else if (moveCharCode >= lowerRangeAllyCodes && moveCharCode <= upperRangeAllyCodes) {
                this.defending.push({ code: currentBoard[move], position: move });
            }
            return !!currentBoard[move] && currentBoard[move].charCodeAt(0) >= lowerRangeEnemyCodes && currentBoard[move].charCodeAt(0) <= upperRangeEnemyCodes;
        }
        return false;
    }

    protected isMoveCapture(move: string, currentBoard: BoardMap): boolean {
        const lowerRangeEnemyCodes = this.color === 'dark' ? 65 : 97;
        const upperRangeEnemyCodes = this.color === 'dark' ? 90 : 122;
        if (currentBoard[move] === 'x') {
            return false;
        }
        return !!currentBoard[move] && currentBoard[move].charCodeAt(0) >= lowerRangeEnemyCodes && currentBoard[move].charCodeAt(0) <= upperRangeEnemyCodes;
    }

    protected isOppositeColor(pieceCode: string): boolean {
        const charCode = pieceCode.charCodeAt(0);
        if (this.color === 'dark') {
            return charCode <= 90;
        }
        return charCode >= 97;
    }

    protected consecutiveMoveSearch(currentBoard: BoardMap, straight: boolean, diagonal: boolean): string[] {
        const moveArray: string[] = [];
        let lookUpLeft = false;
        let lookUp = false;
        let lookUpRight = false;
        let lookDownRight = false;
        let lookDown = false;
        let lookDownLeft = false;
        let lookLeft = false;
        let lookRight = false;
        if (straight) {
            lookUp = true;
            lookDown = true;
            lookLeft = true;
            lookRight = true;
        }
        if (diagonal) {
            lookUpLeft = true;
            lookUpRight = true;
            lookDownRight = true;
            lookDownLeft = true;
        }
        // Look up
        for (let i = this.rank + 1; i <= 8; i++) {
            if (!lookUpLeft && !lookUpRight && !lookUp) {
                break;
            }
            if (lookUp) {
                const newPosition = `${this.file}-${i}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    moveArray.push(newPosition);
                    if (this.isMoveCapture(newPosition, currentBoard)) {
                        lookUp = false;
                    }
                }
                else {
                    lookUp = false;
                }
            }
            if (lookUpRight) {
                const move = `${shiftChar(this.file, i - this.rank)}-${i}`;
                if (this.isValidMovePosition(move, currentBoard)) {
                    moveArray.push(move);
                    if (this.isMoveCapture(move, currentBoard)) {
                        lookUpRight = false;
                    }
                }
                else {
                    lookUpRight = false;
                }
            }
            if (lookUpLeft) {
                const move = `${shiftChar(this.file, (i - this.rank) * -1)}-${i}`;
                if (this.isValidMovePosition(move, currentBoard)) {
                    moveArray.push(move);
                    if (this.isMoveCapture(move, currentBoard)) {
                        lookUpLeft = false;
                    }
                }
                else {
                    lookUpLeft = false;
                }
            }
        }
        // Look down
        for (let i = this.rank - 1; i >= 1; i--) {
            if (!lookDownLeft && !lookDownRight && !lookDown) {
                break;
            }
            if (lookDown) {
                const newPosition = `${this.file}-${i}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    moveArray.push(newPosition);
                    if (this.isMoveCapture(newPosition, currentBoard)) {
                        lookDown = false;
                    }
                }
                else {
                    lookDown = false;
                }
            }
            if (lookDownRight) {
                const move = `${shiftChar(this.file, i - this.rank)}-${i}`;
                if (this.isValidMovePosition(move, currentBoard)) {
                    moveArray.push(move);
                    if (this.isMoveCapture(move, currentBoard)) {
                        lookDownRight = false;
                    }
                }
                else {
                    lookDownRight = false;
                }
            }
            if (lookDownLeft) {
                const move = `${shiftChar(this.file, (i - this.rank) * -1)}-${i}`;
                if (this.isValidMovePosition(move, currentBoard)) {
                    moveArray.push(move);
                    if (this.isMoveCapture(move, currentBoard)) {
                        lookDownLeft = false;
                    }
                }
                else {
                    lookDownLeft = false;
                }
            }
        }
        const fileNumber = this.file.charCodeAt(0);
        const fileLowerBound = 97;
        const fileUpperBound = 104;
        if (lookLeft) {
            for (let i = fileNumber - 1; i >= fileLowerBound; i--) {
                const newPosition = `${String.fromCharCode(i)}-${this.rank}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    moveArray.push(newPosition);
                    if (this.isMoveCapture(newPosition, currentBoard)) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
        }
        if (lookRight) {
            for (let i = fileNumber + 1; i <= fileUpperBound; i++) {
                const newPosition = `${String.fromCharCode(i)}-${this.rank}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    moveArray.push(newPosition);
                    if (this.isMoveCapture(newPosition, currentBoard)) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
        }
        return moveArray;
    }

    public resetLegalMoves(): void {
        this.legalMoves = null;
        this.defending.length = 0;
    }

    private parseCode(): string {
        if (this.name === 'Knight') {
            return this.color === 'dark' ? this.name[1].toLowerCase() : this.name[1].toUpperCase();
        }
        return this.color === 'dark' ? this.name[0].toLowerCase() : this.name[0].toUpperCase();
    }
}
