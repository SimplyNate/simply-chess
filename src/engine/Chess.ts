import Pawn from '@/engine/pieces/Pawn';
import Knight from '@/engine/pieces/Knight';
import King from '@/engine/pieces/King';
import Queen from '@/engine/pieces/Queen';
import Bishop from '@/engine/pieces/Bishop';
import Rook from '@/engine/pieces/Rook';
import { BoardMap, FEN, parsePlacementToMap, separateFEN } from '@/board/utils';

export class Chess {
    fen: FEN;
    boardMap: BoardMap

    constructor(fen: string) {
        this.fen = separateFEN(fen);
        this.boardMap = parsePlacementToMap(this.fen.piecePlacement);
    }
}
