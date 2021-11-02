import { BoardMap } from '@/board/utils';

export type Color = 'light' | 'dark';

export abstract class Piece{
    name: string;
    color: Color;
    position: string | null;
    rank: number;
    file: string;
    legalMoves: string[] = [];

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

    getLegalMoves(currentBoard: BoardMap): string[] {
        return [];
    }

    get code(): string {
        if (this.name === 'Knight') {
            return this.color === 'dark' ? this.name[1].toLowerCase() : this.name[1].toUpperCase();
        }
        return this.color === 'dark' ? this.name[0].toLowerCase() : this.name[0].toUpperCase();
    }
}
