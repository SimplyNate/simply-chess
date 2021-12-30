import { BoardMap, FEN, shiftChar } from '@/utils/utils';
import King from '@/engine/pieces/King';

export type Color = 'light' | 'dark';

export type MoveType = 'consecutive' | 'jump';

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

    // Mutates the list of moves to remove any moves that don't defend king
    public filterMovesCheck(king: King, enemyPieces: Piece[], moves: string[]): string[] {
        const checkedByPiece = king.checkBy;
        let filteredMoves: string[] = [];
        if (checkedByPiece && moves.length > 0) {
            const checkType = checkedByPiece.moveType;
            // For King pieces, filter out moves that overlap enemy moves
            if (this.name === 'King') {
                const dangerMoves: string[] = [];
                for (const enemyPiece of enemyPieces) {
                    if (enemyPiece.legalMoves) {
                        dangerMoves.push(...enemyPiece.legalMoves);
                    }
                }
                filteredMoves = moves.filter(move => !dangerMoves.includes(move));
            }
            // Else, filter out moves that don't defend King
            else {
                const enemyMoves = checkedByPiece.legalMoves;
                const enemyLocation = checkedByPiece.position;
                if (enemyMoves && enemyLocation) {
                    const validMoves: string[] = [enemyLocation];
                    // If consecutive movement, either block or take piece
                    if (checkType === 'consecutive') {
                        // If king and attacker are on same vertical line, add all ranks between and enemyLocation
                        if (checkedByPiece.file === king.file) {
                            // If king is above attacker
                            if (king.rank > checkedByPiece.rank) {
                                for (let i = king.rank - 1; i > checkedByPiece.rank; i--) {
                                    const move = `${king.file}-${i}`;
                                    validMoves.push(move);
                                }
                            }
                            // Else king is below attacker
                            else {
                                for (let i = checkedByPiece.rank - 1; i > king.rank; i--) {
                                    const move = `${king.file}-${i}`;
                                    validMoves.push(move);
                                }
                            }
                        }
                        // If king and attacker are on the same rank
                        else if (checkedByPiece.rank === king.rank) {
                            const kingFile = king.file.charCodeAt(0);
                            const enemyFile = checkedByPiece.file.charCodeAt(0);
                            // If king is to the left of the attacker
                            if (kingFile < enemyFile) {
                                for (let i = kingFile + 1; i < enemyFile; i++) {
                                    const move = `${String.fromCharCode(i)}-${king.rank}`;
                                    validMoves.push(move);
                                }
                            }
                            // Else king is to the right of the attacker
                            else {
                                for (let i = enemyFile + 1; i < kingFile; i++) {
                                    const move = `${String.fromCharCode(i)}-${king.rank}`;
                                    validMoves.push(move);
                                }
                            }
                        }
                        // Else they are diagonal
                        else {
                            const kingFile = king.file.charCodeAt(0);
                            const enemyFile = checkedByPiece.file.charCodeAt(0);
                            // If king is to the left, use king, else, use enemy
                            let fileTracker = kingFile < enemyFile ? kingFile + 1 : enemyFile + 1;
                            let startRank;
                            let endRank;
                            // If king is above
                            if (king.rank > checkedByPiece.rank) {
                                startRank = checkedByPiece.rank + 1;
                                endRank = king.rank;
                            }
                            // Else king is below
                            else {
                                startRank = king.rank + 1;
                                endRank = checkedByPiece.rank;
                            }
                            for (let i = startRank; i < endRank; i++) {
                                const move = `${String.fromCharCode(fileTracker)}-${i}`;
                                validMoves.push(move);
                                fileTracker += 1;
                            }
                        }
                    }
                    // Else, can only take piece out
                    filteredMoves = moves.filter(move => validMoves.includes(move));
                }
            }
        }
        this.legalMoves = filteredMoves;
        return filteredMoves;
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
        const upperRangeEnemyCodes = this.color === 'dark' ? 72 : 104;
        return !!(currentBoard[move]) && (currentBoard[move] === 'x' ||
            (currentBoard[move].charCodeAt(0) >= lowerRangeEnemyCodes && currentBoard[move].charCodeAt(0) <= upperRangeEnemyCodes));
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
        for (let i = this.rank; i <= 8; i++) {
            if (!lookUpLeft && !lookUpRight && !lookUp) {
                break;
            }
            if (lookUp) {
                const newPosition = `${this.file}-${i}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    moveArray.push(newPosition);
                }
                else {
                    lookUp = false;
                }
            }
            if (lookUpRight) {
                const move = `${shiftChar(this.file, i)}-${i}`;
                if (this.isValidMovePosition(move, currentBoard)) {
                    moveArray.push(move);
                }
                else {
                    lookUpRight = false;
                }
            }
            if (lookUpLeft) {
                const move = `${shiftChar(this.file, i * -1)}-${i}`;
                if (this.isValidMovePosition(move, currentBoard)) {
                    moveArray.push(move);
                }
                else {
                    lookUpLeft = false;
                }
            }
        }
        // Look down
        for (let i = this.rank; i >= 1; i--) {
            if (!lookDownLeft && !lookDownRight && !lookDown) {
                break;
            }
            if (lookDown) {
                const newPosition = `${this.file}-${i}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    moveArray.push(newPosition);
                }
                else {
                    lookDown = false;
                }
            }
            if (lookDownRight) {
                const move = `${shiftChar(this.file, i)}-${i}`;
                if (this.isValidMovePosition(move, currentBoard)) {
                    moveArray.push(move);
                }
                else {
                    lookDownRight = false;
                }
            }
            if (lookDownLeft) {
                const move = `${shiftChar(this.file, i * -1)}-${i}`;
                if (this.isValidMovePosition(move, currentBoard)) {
                    moveArray.push(move);
                }
                else {
                    lookDownLeft = false;
                }
            }
        }
        const fileNumber = this.file.charCodeAt(0);
        let fileLowerBound = 65;
        let fileUpperBound = 72;
        if (this.color === 'dark') {
            fileLowerBound = 97;
            fileUpperBound = 104;
        }
        if (lookLeft) {
            for (let i = fileNumber - 1; i >= fileLowerBound; i--) {
                const newPosition = `${String.fromCharCode(i)}-${this.rank}`;
                if (this.isValidMovePosition(newPosition, currentBoard)) {
                    moveArray.push(newPosition);
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
    }

    private parseCode(): string {
        if (this.name === 'Knight') {
            return this.color === 'dark' ? this.name[1].toLowerCase() : this.name[1].toUpperCase();
        }
        return this.color === 'dark' ? this.name[0].toLowerCase() : this.name[0].toUpperCase();
    }
}
