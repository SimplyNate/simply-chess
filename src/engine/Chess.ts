import Pawn from '@/engine/pieces/Pawn';
import Knight from '@/engine/pieces/Knight';
import King from '@/engine/pieces/King';
import Queen from '@/engine/pieces/Queen';
import Bishop from '@/engine/pieces/Bishop';
import Rook from '@/engine/pieces/Rook';
import { Piece } from '@/engine/pieces/Piece';
import { BoardMap, FEN, parsePlacementToMap, separateFEN } from '@/board/utils';

interface PieceMap {
    [index: string]: Piece,
}

export class Chess {
    fen: FEN;
    boardMap: BoardMap;
    pieces: PieceMap;

    constructor(fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
        this.fen = separateFEN(fen);
        this.boardMap = parsePlacementToMap(this.fen.piecePlacement);
        this.pieces = this.parsePieces();
    }

    private parsePieces(): PieceMap {
        const pieceMap: PieceMap = {};
        for (const position of Object.keys(this.boardMap)) {
            const piece = this.boardMap[position];
            if (piece !== 'x') {
                // If char code of piece is lowercase, it is dark
                const color = piece.charCodeAt(0) > 96 ? 'dark' : 'light';
                if (piece === 'p' || piece === 'P') {
                    pieceMap[position] = new Pawn(color, position);
                }
                else if (piece === 'r' || piece === 'R') {
                    pieceMap[position] = new Rook(color, position, this.fen.castlingAvailability);
                }
                else if (piece === 'n' || piece === 'N') {
                    pieceMap[position] = new Knight(color, position);
                }
                else if (piece === 'b' || piece === 'B') {
                    pieceMap[position] = new Bishop(color, position);
                }
                else if (piece === 'q' || piece === 'Q') {
                    pieceMap[position] = new Queen(color, position);
                }
                else {
                    pieceMap[position] = new King(color, position, this.fen.castlingAvailability);
                }
            }
        }
        return pieceMap;
    }
}
