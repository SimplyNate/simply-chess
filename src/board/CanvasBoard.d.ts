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
    dragNode: null | PIXI.DisplayObject,
    originalParent: null | PIXI.DisplayObject,
    tempContainer: PIXI.Container,
}

export interface IHighlight {
    originalPlace: null | PIXI.Graphics,
    closestTarget: null | PIXI.Graphics,
    legalTargets: PIXI.Graphics[]
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
    row: number[],
    rank: string[],
    dark: number,
    light: number,
    pieceMap: number[],
    drag: IDrag,
    highlight: IHighlight,
}

export type LegalMovesForSelection = string[];

export interface BoardConfig {
    light: number | undefined,
    dark: number | undefined,
}
