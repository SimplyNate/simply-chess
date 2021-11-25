import Pawn from '@/engine/pieces/Pawn';
import Knight from '@/engine/pieces/Knight';
import King from '@/engine/pieces/King';
import Queen from '@/engine/pieces/Queen';
import Bishop from '@/engine/pieces/Bishop';
import Rook from '@/engine/pieces/Rook';
import { Piece } from '@/engine/pieces/Piece';
import { BoardMap, FEN, parsePlacementToMap, rebuildPlacementFromMap, separateFEN, stringifyFEN } from '@/utils/utils';

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

    public getLegalMoves(position: string): string[] {
        const piece = this.pieces[position];
        if (piece) {
            return piece.getLegalMoves(this.boardMap);
        }
        return [];
    }

    public move(from: string, to: string): string {
        const moveString = this.boardMap[from];
        if (moveString !== 'x') {
            const movePiece = this.pieces[from];
            if (movePiece.getLegalMoves(this.boardMap).includes(to)) {
                const capturedPiece = this.pieces[to];
                movePiece.move(to);
                this.boardMap[to] = moveString;
                this.pieces[to] = movePiece;
                this.updateFEN(movePiece, capturedPiece);
            }
        }
        return this.fenString;
    }

    private updateFEN(movePiece: Piece, capturedPiece: Piece): void {
        this.fen.piecePlacement = rebuildPlacementFromMap(this.boardMap);
        if (movePiece.color === 'dark') {
            this.fen.fullMoveNumber += 1;
        }
        if (movePiece.name === 'Pawn' || capturedPiece) {
            this.fen.halfMoveClock = 0;
        }
        else {
            this.fen.halfMoveClock += 1;
        }
        this.updateEnPassant(movePiece);
        this.updateCastling(movePiece);
        this.fen.activeColor = this.fen.activeColor === 'w' ? 'b' : 'w';
    }

    private updateCastling(movePiece: Piece): void {
        // If Piece is king, check if move is castling
        if (this.fen.castlingAvailability !== '-' && movePiece.name === 'King') {
            // check if it has gone to the castling long or short position
            if (movePiece.color === 'light') {
                if (movePiece.position === 'g-1' && this.fen.castlingAvailability.includes('K')) {
                    this.fen.castlingAvailability.replace('K', '');
                    this.fen.castlingAvailability.replace('Q', '');
                    const rook = this.pieces['h-1'];
                    rook.move('f-1');
                }
                else if (movePiece.position === 'c-1' && this.fen.castlingAvailability.includes('Q')) {
                    this.fen.castlingAvailability.replace('Q', '');
                    this.fen.castlingAvailability.replace('K', '');
                    const rook = this.pieces['a-1'];
                    rook.move('d-1');
                }
            }
            else {
                if (movePiece.position === 'g-8' && this.fen.castlingAvailability.includes('k')) {
                    this.fen.castlingAvailability.replace('k', '');
                    this.fen.castlingAvailability.replace('q', '');
                    const rook = this.pieces['h-8'];
                    rook.move('f-8');
                }
                else if (movePiece.position === 'c-8' && this.fen.castlingAvailability.includes('q')) {
                    this.fen.castlingAvailability.replace('q', '');
                    this.fen.castlingAvailability.replace('k', '');
                    const rook = this.pieces['a-8'];
                    rook.move('d-8');
                }
            }
        }
        else if (movePiece.name === 'Rook' && this.fen.castlingAvailability !== '-') {
            if (movePiece.color === 'light') {
                if (this.fen.castlingAvailability.includes('K') && movePiece.lastPosition === 'h-1') {
                    this.fen.castlingAvailability.replace('K', '');
                }
                else if (this.fen.castlingAvailability.includes('Q') && movePiece.lastPosition === 'a-1') {
                    this.fen.castlingAvailability.replace('Q', '');
                }
            }
            else { // movePiece.color === 'dark'
                if (this.fen.castlingAvailability.includes('k') && movePiece.lastPosition === 'h-8') {
                    this.fen.castlingAvailability.replace('k', '');
                }
                else if (this.fen.castlingAvailability.includes('q') && movePiece.lastPosition === 'a-8') {
                    this.fen.castlingAvailability.replace('q', '');
                }
            }
        }
        if (this.fen.castlingAvailability.length === 0) {
            this.fen.castlingAvailability = '-';
        }
    }

    private updateEnPassant(movePiece: Piece) {
        if (movePiece.name === 'Pawn') {

        }
        else {
            this.fen.enPassantTargetSquare = '-';
        }
    }

    public print(): void {
        console.log(`
8|${this.boardMap['a-8']}|${this.boardMap['b-8']}|${this.boardMap['c-8']}|${this.boardMap['d-8']}|${this.boardMap['e-8']}|${this.boardMap['f-8']}|${this.boardMap['g-8']}|${this.boardMap['h-8']}|
7|${this.boardMap['a-7']}|${this.boardMap['b-7']}|${this.boardMap['c-7']}|${this.boardMap['d-7']}|${this.boardMap['e-7']}|${this.boardMap['f-7']}|${this.boardMap['g-7']}|${this.boardMap['h-7']}|
6|${this.boardMap['a-6']}|${this.boardMap['b-6']}|${this.boardMap['c-6']}|${this.boardMap['d-6']}|${this.boardMap['e-6']}|${this.boardMap['f-6']}|${this.boardMap['g-6']}|${this.boardMap['h-6']}|
5|${this.boardMap['a-5']}|${this.boardMap['b-5']}|${this.boardMap['c-5']}|${this.boardMap['d-5']}|${this.boardMap['e-5']}|${this.boardMap['f-5']}|${this.boardMap['g-5']}|${this.boardMap['h-5']}|
4|${this.boardMap['a-4']}|${this.boardMap['b-4']}|${this.boardMap['c-4']}|${this.boardMap['d-4']}|${this.boardMap['e-4']}|${this.boardMap['f-4']}|${this.boardMap['g-4']}|${this.boardMap['h-4']}|
3|${this.boardMap['a-3']}|${this.boardMap['b-3']}|${this.boardMap['c-3']}|${this.boardMap['d-3']}|${this.boardMap['e-3']}|${this.boardMap['f-3']}|${this.boardMap['g-3']}|${this.boardMap['h-3']}|
2|${this.boardMap['a-2']}|${this.boardMap['b-2']}|${this.boardMap['c-2']}|${this.boardMap['d-2']}|${this.boardMap['e-2']}|${this.boardMap['f-2']}|${this.boardMap['g-2']}|${this.boardMap['h-2']}|
1|${this.boardMap['a-1']}|${this.boardMap['b-1']}|${this.boardMap['c-1']}|${this.boardMap['d-1']}|${this.boardMap['e-1']}|${this.boardMap['f-1']}|${this.boardMap['g-1']}|${this.boardMap['h-1']}|
  a b c d e g h h`);
    }

    public get fenString(): string {
        return stringifyFEN(this.fen);
    }
}
