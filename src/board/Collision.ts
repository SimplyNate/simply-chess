import * as PIXI from 'pixi.js';

export function isColliding(dragNode: PIXI.Sprite, legalSpaces: PIXI.Sprite[]): PIXI.Sprite[] {
    const collisions = [];
    const dragX = dragNode.x - (dragNode.width / 2);
    const dragY = dragNode.y - (dragNode.height / 2);
    const dragX2 = dragX + dragNode.width;
    const dragY2 = dragY + dragNode.height;
    const filtered = legalSpaces.filter((f) => {
        return Math.abs(f.x - dragNode.x) <= dragNode.width * 2 && Math.abs(f.y - dragNode.y) <= dragNode.height * 2;
    });
    for (const place of filtered) {
        const { x, y, width, height } = place;
        const x1 = x - (width / 2);
        const y1 = y - (height / 2);
        const x2 = x1 + width;
        const y2 = y1 + height;
        if (dragX < x2 && dragX2 > x1 && dragY < y2 && dragY2 > y1) {
            collisions.push(place);
        }
    }
    return collisions;
}

export function getNearestCollision(collisions: PIXI.Sprite[], cX: number, cY: number): PIXI.Sprite {
    collisions.sort((a, b) => {
        const aParams = {
            x1: a.x,
            x2: a.x + a.width,
            y1: a.y,
            y2: a.y + a.height,
        };
        const bParams = {
            x1: b.x,
            x2: b.x + b.width,
            y1: b.y,
            y2: b.y + b.height,
        };
        const aCenter = {
            x: aParams.x2 - aParams.x1,
            y: aParams.y2 - aParams.y1,
        };
        const bCenter = {
            x: bParams.x2 - bParams.x1,
            y: bParams.y2 - bParams.y1,
        };
        const aDelta = {
            x: Math.abs(cX - aCenter.x),
            y: Math.abs(cY - aCenter.y),
        };
        const aHypotenuse = Math.hypot(aDelta.x, aDelta.y);
        const bDelta = {
            x: Math.abs(cX - bCenter.x),
            y: Math.abs(cY - bCenter.y),
        };
        const bHypotenuse = Math.hypot(bDelta.x, bDelta.y);
        return aHypotenuse - bHypotenuse;
    });
    return collisions[0];
}
