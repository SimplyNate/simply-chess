import Pawn from './pieces/Pawn';
import Knight from './pieces/Knight';
import King from './pieces/King';
import Queen from './pieces/Queen';
import Bishop from './pieces/Bishop';
import Rook from './pieces/Rook';
import { Color, Piece } from './pieces/Piece';
import { BoardMap, FEN, parsePlacementToMap, rebuildPlacementFromMap, separateFEN, shiftChar, stringifyFEN } from '../utils/utils';

// PieceMap indexes based on position of Piece on board
interface PieceMap {
    [index: string]: Piece,
}

interface Kings {
    k: King,
    K: King,
}

interface ParsedPieces {
    piecesByLocation: PieceMap,
    kings: Kings,
}

interface PiecesByColor {
    light: Piece[],
    dark: Piece[],
}

type CheckStatus = 'light' | 'dark' | 'none';

export class Chess {
    fen: FEN;
    boardMap: BoardMap;
    piecesByLocation: PieceMap; // this tracks pieces by position
    kings: Kings;
    piecesByColor: PiecesByColor = { light: [], dark: [] };
    checkStatus: CheckStatus = 'none';
    checkMateStatus: boolean = false;
    tie: boolean = false;

    constructor(fen: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
        this.fen = separateFEN(fen);
        this.boardMap = parsePlacementToMap(this.fen.piecePlacement);
        const { piecesByLocation, kings } = this.parsePieces();
        this.piecesByLocation = piecesByLocation;
        this.kings = kings;
        this.resetLegalMovesAndCheckStatus();
        this.updateCheckMate();
    }

    private parsePieces(): ParsedPieces {
        const piecesByLocation: PieceMap = {};
        // For typescript consistency, pre-assign Kings so compiler doesn't get angry
        let lightKing = new King('light', '', '');
        let darkKing = new King('light', '', '');
        for (const position of Object.keys(this.boardMap)) {
            const piece = this.boardMap[position];
            if (piece !== 'x') {
                let pieceInstance;
                // If char code of piece is lowercase, it is dark
                const color = piece.charCodeAt(0) > 96 ? 'dark' : 'light';
                if (piece === 'p' || piece === 'P') {
                    pieceInstance = new Pawn(color, position);
                }
                else if (piece === 'r' || piece === 'R') {
                    pieceInstance = new Rook(color, position, this.fen.castlingAvailability);
                }
                else if (piece === 'n' || piece === 'N') {
                    pieceInstance = new Knight(color, position);
                }
                else if (piece === 'b' || piece === 'B') {
                    pieceInstance = new Bishop(color, position);
                }
                else if (piece === 'q' || piece === 'Q') {
                    pieceInstance = new Queen(color, position);
                }
                else {
                    pieceInstance = new King(color, position, this.fen.castlingAvailability);
                    if (piece === 'k') {
                        darkKing = pieceInstance;
                    }
                    else {
                        lightKing = pieceInstance;
                    }
                }
                piecesByLocation[position] = pieceInstance;
                this.piecesByColor[color].push(pieceInstance);
            }
        }
        return { piecesByLocation, kings: { k: darkKing, K: lightKing } };
    }

    public getLegalMoves(position: string): string[] {
        const piece = this.piecesByLocation[position];
        if (piece) {
            return [...piece.getLegalMoves(this.boardMap, this.fen)];
        }
        return [];
    }

    public move(from: string, to: string, skipValidation: boolean = false): string {
        let movePiece = this.piecesByLocation[from];
        if (movePiece) {
            const legalMoves = movePiece.getLegalMoves(this.boardMap, this.fen);
            if (legalMoves.includes(to) || skipValidation) {
                let capturedPiece = false;
                if (this.piecesByLocation[to] || (`${to[0]}${to[2]}` === this.fen.enPassantTargetSquare && movePiece.name === 'Pawn')) {
                    let deleteLocation = to;
                    if (`${to[0]}${to[2]}` === this.fen.enPassantTargetSquare && movePiece.name === 'Pawn') {
                        deleteLocation = `${to[0]}-`;
                        if (to[2] === '3') {
                            deleteLocation += '4';
                        }
                        else {
                            deleteLocation += '5';
                        }
                    }
                    const deletePieceColor = this.piecesByLocation[deleteLocation].color;
                    for (let i = 0; i < this.piecesByColor[deletePieceColor].length; i++) {
                        if (this.piecesByColor[deletePieceColor][i] === this.piecesByLocation[deleteLocation]) {
                            this.piecesByColor[deletePieceColor].splice(i, 1);
                            break;
                        }
                    }
                    capturedPiece = true;
                    delete this.piecesByLocation[deleteLocation];
                    this.boardMap[deleteLocation] = 'x';
                }
                movePiece.move(to);
                // Handle pawn promotion
                if (movePiece.name === 'Pawn' && (movePiece.rank === 1 || movePiece.rank === 8)) {
                    movePiece = new Queen(movePiece.color, movePiece.position);
                    for (let i = 0; i < this.piecesByColor[movePiece.color].length; i++) {
                        if (this.piecesByColor[movePiece.color][i] === this.piecesByLocation[movePiece.position]) {
                            this.piecesByColor[movePiece.color].splice(i, 1, movePiece);
                            break;
                        }
                    }
                }
                this.piecesByLocation[to] = movePiece;
                this.boardMap[to] = movePiece.code;
                delete this.piecesByLocation[from];
                this.boardMap[from] = 'x';
                this.updateFEN(movePiece, capturedPiece);
                this.resetLegalMovesAndCheckStatus();
                this.updateCheckMate();
            }
        }
        return this.fenString;
    }

    private updateFEN(movePiece: Piece, capturedPiece: boolean): void {
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
        this.fen.activeColor = movePiece.color === 'light' ? 'b' : 'w';
    }

    private updateCastling(movePiece: Piece): void {
        // If Piece is king, check if move is castling
        if (this.fen.castlingAvailability !== '-' && movePiece instanceof King) {
            const halfMoveClock = this.fen.halfMoveClock;
            const fullMoveClock = this.fen.fullMoveNumber;
            // check if it has gone to the castling long or short position
            if (movePiece.color === 'light') {
                if (movePiece.position === 'g-1' && this.fen.castlingAvailability.includes('K')) {
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('K', '');
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('Q', '');
                    this.move('h-1', 'f-1', true);
                }
                else if (movePiece.position === 'c-1' && this.fen.castlingAvailability.includes('Q')) {
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('Q', '');
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('K', '');
                    this.move('a-1', 'd-1', true);
                }
            }
            else {
                if (movePiece.position === 'g-8' && this.fen.castlingAvailability.includes('k')) {
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('k', '');
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('q', '');
                    this.move('h-8', 'f-8', true);
                }
                else if (movePiece.position === 'c-8' && this.fen.castlingAvailability.includes('q')) {
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('q', '');
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('k', '');
                    this.move('a-8', 'd-8', true);
                }
            }
            // Reset move number and clock due to moving rook
            this.fen.halfMoveClock = halfMoveClock;
            this.fen.fullMoveNumber = fullMoveClock;
            movePiece.canCastleShort = false;
            movePiece.canCastleLong = false;
        }
        else if (movePiece instanceof Rook && this.fen.castlingAvailability !== '-') {
            if (movePiece.color === 'light') {
                if (this.fen.castlingAvailability.includes('K') && movePiece.lastPosition === 'h-1') {
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('K', '');
                }
                else if (this.fen.castlingAvailability.includes('Q') && movePiece.lastPosition === 'a-1') {
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('Q', '');
                }
            }
            else { // movePiece.color === 'dark'
                if (this.fen.castlingAvailability.includes('k') && movePiece.lastPosition === 'h-8') {
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('k', '');
                }
                else if (this.fen.castlingAvailability.includes('q') && movePiece.lastPosition === 'a-8') {
                    this.fen.castlingAvailability = this.fen.castlingAvailability.replace('q', '');
                }
            }
            movePiece.canCastle = false;
            movePiece.castleSide = '-';
        }
        if (this.fen.castlingAvailability.length === 0) {
            this.fen.castlingAvailability = '-';
        }
    }

    private updateEnPassant(movePiece: Piece) {
        this.fen.enPassantTargetSquare = '-';
        if (movePiece instanceof Pawn) {
            if (movePiece.inStartingPosition) {
                movePiece.inStartingPosition = false;
                // If the pawn just moved two spaces
                if (movePiece.lastPosition && Math.abs(Number(movePiece.lastPosition[2]) - Number(movePiece.position[2])) === 2) {
                    if (Number(movePiece.lastPosition[2]) > movePiece.rank) {
                        this.fen.enPassantTargetSquare = `${movePiece.file}${movePiece.rank + 1}`;
                    }
                    else {
                        this.fen.enPassantTargetSquare = `${movePiece.file}${movePiece.rank - 1}`;
                    }
                }
            }
        }
    }

    protected filterKingMovesDanger(king: King, enemyPieces: Piece[]): void {
        // this should just return legalMoves and shouldn't recalculate
        const kingMoves = king.getLegalMoves(this.boardMap, this.fen);
        const dangerMoves: string[] = [];
        for (const enemyPiece of enemyPieces) {
            if (enemyPiece.legalMoves) {
                if (enemyPiece instanceof Pawn) {
                    for (const move of enemyPiece.legalMoves) {
                        // If move is a capture move/diagonal move
                        if (move[0] !== enemyPiece.file) {
                            dangerMoves.push(move);
                        }
                    }
                }
                else {
                    dangerMoves.push(...enemyPiece.legalMoves);
                }
                for (const defense of enemyPiece.defending) {
                    dangerMoves.push(defense.position);
                }
            }
        }
        king.legalMoves = kingMoves.filter(move => !dangerMoves.includes(move));
    }

    // Mutates the list of moves to remove any moves that don't defend king
    protected filterMovesCheck(piece: Piece, king: King, enemyPieces: Piece[], moves: string[]): string[] {
        const checkedByPiece = king.checkBy ? this.piecesByLocation[king.checkBy] : null;
        let filteredMoves: string[] = [];
        if (checkedByPiece && moves.length > 0) {
            const checkType = checkedByPiece.moveType;
            // For King pieces, filter out moves that overlap enemy moves
            if (piece.name === 'King') {
                const dangerMoves: string[] = [];
                for (const enemyPiece of enemyPieces) {
                    if (enemyPiece.legalMoves) {
                        dangerMoves.push(...enemyPiece.legalMoves);
                        for (const defense of enemyPiece.defending) {
                            dangerMoves.push(defense.position);
                        }
                    }
                }
                // Check straight line pieces
                if (checkedByPiece instanceof Queen || checkedByPiece instanceof Rook) {
                    // If king and attacker are on the same row
                    if (checkedByPiece.rank === king.rank) {
                        // If attacker is to the left of king
                        if (checkedByPiece.file.charCodeAt(0) < king.file.charCodeAt(0)) {
                            // King cannot move right
                            dangerMoves.push(`${shiftChar(king.file, 1)}-${king.rank}`);
                        }
                        // Else the attacker is to the right of king
                        else {
                            // King cannot move left
                            dangerMoves.push(`${shiftChar(king.file, -1)}-${king.rank}`);
                        }
                    }
                    // Else if king and attacker are on same column
                    else if (checkedByPiece.file === king.file) {
                        // If attacker is above king
                        if (checkedByPiece.rank > king.rank) {
                            // King cannot move down
                            dangerMoves.push(`${king.file}-${king.rank - 1}`);
                        }
                        // Else attacker is below king
                        else {
                            // King cannot move up
                            dangerMoves.push(`${king.file}-${king.rank + 1}`);
                        }
                    }
                }
                // Check diagonal pieces
                if (checkedByPiece instanceof Queen || checkedByPiece instanceof Bishop) {
                    // If king is up-left
                    if (king.file.charCodeAt(0) < checkedByPiece.file.charCodeAt(0) && king.rank > checkedByPiece.rank) {
                        // King cannot move up-left
                        dangerMoves.push(`${shiftChar(king.file, -1)}-${king.rank + 1}`);
                    }
                    // If king is up-right
                    else if (king.file.charCodeAt(0) > checkedByPiece.file.charCodeAt(0) && king.rank > checkedByPiece.rank) {
                        dangerMoves.push(`${shiftChar(king.file, 1)}-${king.rank + 1}`);
                    }
                    // If king is down-left
                    else if (king.file.charCodeAt(0) < checkedByPiece.file.charCodeAt(0) && king.rank < checkedByPiece.rank) {
                        dangerMoves.push(`${shiftChar(king.file, -1)}-${king.rank - 1}`);
                    }
                    // If king is down-right
                    else if (king.file.charCodeAt(0) > checkedByPiece.file.charCodeAt(0) && king.rank < checkedByPiece.rank) {
                        dangerMoves.push(`${shiftChar(king.file, 1)}-${king.rank - 1}`);
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
        piece.legalMoves = filteredMoves;
        return filteredMoves;
    }

    // Remove moves that would expose king to an attacker
    protected filterMovesThatExposeKing(piece: Piece, king: King): string[] {
        // Simulate move and see if king is in check
        const pieceMoves = piece.getLegalMoves(this.boardMap, this.fen);
        const kingOriginalCheckStatus = king.isInCheck;
        const kingOriginalCheckBy = king.checkBy;
        const filteredMoves: string[] = [];
        for (const move of pieceMoves) {
            const testBoard: BoardMap = JSON.parse(JSON.stringify(this.boardMap));
            testBoard[move] = piece.code;
            testBoard[piece.position] = 'x';
            king.getCheckStatus(testBoard);
            if (!king.isInCheck) {
                filteredMoves.push(move);
            }
        }
        // Reset king check status
        king.isInCheck = kingOriginalCheckStatus;
        king.checkBy = kingOriginalCheckBy;
        return filteredMoves;
    }

    private processMovesForColor(color: Color, filterMovesCheck: boolean): void {
        let pieces: Piece[];
        let king: King;
        let enemyPieces: Piece[];
        if (color === 'light') {
            pieces = this.piecesByColor.light;
            king = this.kings.K;
            enemyPieces = this.piecesByColor.dark;
        }
        else {
            pieces = this.piecesByColor.dark;
            king = this.kings.k;
            enemyPieces = this.piecesByColor.light;
        }
        for (const piece of pieces) {
            const moves = piece.getLegalMoves(this.boardMap, this.fen);
            if (filterMovesCheck) {
                this.filterMovesCheck(piece, king, enemyPieces, moves);
            }
            if (piece instanceof King) {
                this.filterKingMovesDanger(piece, enemyPieces);
            }
            else {
                piece.legalMoves = this.filterMovesThatExposeKing(piece, king);
            }
        }
    }

    private resetLegalMovesAndCheckStatus(): void {
        let justMoved: Color;
        let activeColor: Color;
        if (this.fen.activeColor === 'w') {
            justMoved = 'dark';
            activeColor = 'light';
        }
        else {
            justMoved = 'light';
            activeColor = 'dark';
        }
        for (const location of Object.keys(this.piecesByLocation)) {
            this.piecesByLocation[location].resetLegalMoves();
        }
        this.processMovesForColor(justMoved, false);
        this.updateCheckStatus();
        this.processMovesForColor(activeColor, this.checkStatus !== 'none');
        this.checkTieStatus();
    }

    private checkTieStatus(): void {
        // Tie is declared when active color is not in check but has no legal moves available
        if (this.checkStatus === 'none') {
            const activeColor = this.fen.activeColor === 'w' ? 'light' : 'dark';
            let canMove = false;
            for (const piece of this.piecesByColor[activeColor]) {
                if (piece.getLegalMoves(this.boardMap, this.fen).length > 0) {
                    canMove = true;
                    break;
                }
            }
            if (!canMove) {
                this.tie = true;
            }
        }
    }

    private updateCheckStatus(): void {
        /*
        Rules for Check:
            1. King pieces lies within an enemy piece's legal positions
            2. You only need to check if active color's king is in check
        Consideration:
            * If a FEN string is a checkmate, this may not calculate properly
         */
        let checkStatus: CheckStatus = 'none';
        const activeColor = this.fen.activeColor === 'w' ? 'light' : 'dark';
        const king = activeColor === 'light' ? this.kings.K : this.kings.k;
        const isCheck = king.getCheckStatus(this.boardMap);
        if (isCheck.check) {
            checkStatus = activeColor;
        }
        this.checkStatus = checkStatus;
    }

    private updateCheckMate(): void {
        /*
        Rules for checkmate:
            1. King cannot move
            2. No pieces can cover the King
         */
        const possibleMoves = [];
        if (this.checkStatus !== 'none') {
            const pieces = this.piecesByColor[this.checkStatus];
            for (const piece of pieces) {
                // This should already be pre-calculated and filtered for checked move sets
                const legalMoves = piece.getLegalMoves(this.boardMap, this.fen);
                possibleMoves.push(...legalMoves);
            }
            this.checkMateStatus = possibleMoves.length === 0;
        }
    }

    /*
    private promotePawn(pawn: Piece): Piece {
        return new Queen(pawn.color, pawn.position);
    }
     */

    public getAllPieces(): Piece[] {
        const pieces = [];
        for (const position of Object.keys(this.piecesByLocation)) {
            pieces.push(this.piecesByLocation[position]);
        }
        return pieces;
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
