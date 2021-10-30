import { BoardMap } from '@/board/utils';

export type Color = 'light' | 'dark';

export interface IPiece {
    getLegalMoves(currentBoard: BoardMap): string[];
}

export abstract class Piece {
    name: string;
    color: Color;
    position: string | null;
    rank: number;
    file: string;

    protected constructor(color: Color, position: string, name: string) {
        this.color = color;
        this.position = position;
        this.name = name;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
    }

    move(position: string): void {
        this.position = position;
        const [file, rank] = position.split('-');
        this.rank = Number(rank);
        this.file = file;
    }

    get code(): string {
        if (this.name === 'Knight') {
            return this.color === 'dark' ? this.name[1].toLowerCase() : this.name[1].toUpperCase();
        }
        return this.color === 'dark' ? this.name[0].toLowerCase() : this.name[0].toUpperCase();
    }
}
