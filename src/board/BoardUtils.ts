import * as PIXI from 'pixi.js';
import { BoardMap, FEN } from '@/board/utils';

export interface Pieces {
    [index: string]: PIXI.Sprite,
}

export interface Textures {
    [index: string]: PIXI.Texture,
}

export interface SVGs {
    [index: string]: PIXI.SVGResource,
}

export interface SquareMap {
    [index: string]: PIXI.Container,
}

export interface IDrag {
    dragData: null | PIXI.InteractionData,
    dragNode: null | PIXI.Sprite,
    originalParent: null | PIXI.Sprite,
    tempContainer: PIXI.Container,
}

export interface IHighlight {
    originalPlace: null | PIXI.Graphics,
    closestTarget: null | PIXI.Graphics,
    legalTargets: PIXI.Graphics[],
    collisions: PIXI.Graphics[],
}

export interface ICanvasBoard {
    app: PIXI.Application,
    containerLength: number,
    squareLength: number,
    boardContainer: PIXI.Container,
    pieces: Pieces,
    textures: Textures,
    svgs: SVGs,
    squareMap: SquareMap,
    boardMap: BoardMap,
    fen: FEN,
    dark: number,
    light: number,
    drag: IDrag,
    highlight: IHighlight,
    placedPieces: PIXI.Sprite[],
    freeSpaces: PIXI.Container[],
    globalOffset: {
        x: number,
        y: number,
    }
}

export type LegalMovesForSelection = string[];

export interface Selection {
    piece: string,
    place: string,
}

export interface BoardConfig {
    light: number | undefined,
    dark: number | undefined,
}
