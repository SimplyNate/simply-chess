import { BoardMap, FEN, shiftChar } from '@/utils/utils';
import { Color, Piece } from '@/engine/pieces/Piece';

export default class Bishop extends Piece {
    constructor(color: Color, position: string) {
        super(color, position, 'Bishop', 'consecutive');
    }

    public getLegalMoves(currentBoard: BoardMap, fen: FEN): string[] {
        if (!this.legalMoves) {
            this.legalMoves = [];
            let lookUpLeft = true;
            let lookUpRight = true;
            let lookDownLeft = true;
            let lookDownRight = true;
            for (let i = this.rank; i <= 8; i++) {
                if (lookUpRight) {
                    const move = `${shiftChar(this.file, i)}-${i}`;
                    if (this.isValidMovePosition(move, currentBoard)) {
                        this.legalMoves.push(move);
                    }
                    else {
                        lookUpRight = false;
                    }
                }
                if (lookUpLeft) {
                    const move = `${shiftChar(this.file, i * -1)}-${i}`;
                    if (this.isValidMovePosition(move, currentBoard)) {
                        this.legalMoves.push(move);
                    }
                    else {
                        lookUpLeft = false;
                    }
                }
                if (!lookUpLeft && !lookUpRight) {
                    break;
                }
            }
            for (let i = this.rank; i >= 1; i--) {
                if (lookDownRight) {
                    const move = `${shiftChar(this.file, i)}-${i}`;
                    if (this.isValidMovePosition(move, currentBoard)) {
                        this.legalMoves.push(move);
                    }
                    else {
                        lookDownRight = false;
                    }
                }
                if (lookDownLeft) {
                    const move = `${shiftChar(this.file, i * -1)}-${i}`;
                    if (this.isValidMovePosition(move, currentBoard)) {
                        this.legalMoves.push(move);
                    }
                    else {
                        lookDownLeft = false;
                    }
                }
                if (!lookDownLeft && !lookDownRight) {
                    break;
                }
            }
        }
        return this.legalMoves;
    }
}
