import * as PIXI from 'pixi.js';

export function isColliding(dragNode: PIXI.Sprite, legalSpaces: PIXI.Sprite[], globalOffset: { x: number, y: number }): PIXI.Sprite[] {
    const collisions = [];
    const aX = dragNode.x - (dragNode.width / 2);
    const aY = dragNode.y - (dragNode.height / 2);
    const aX2 = aX + dragNode.width;
    const aY2 = aY + dragNode.height;
    // const filtered = legalSpaces.filter((f) => {
    //     return Math.abs(f.x - dragNode.x) <= dragNode.width * 2 && Math.abs(f.y - dragNode.y) <= dragNode.height * 2;
    // });
    for (const place of legalSpaces) {
        // Use parent node because "place" inherits position from parent
        const parent = place.parent;
        const bX1 = parent.x - (parent.width / 2) + globalOffset.x;
        const bY1 = parent.y - (parent.height / 2) + globalOffset.y;
        const bX2 = bX1 + parent.width;
        const bY2 = bY1 + parent.height;
        if (aX <= bX2 && aX2 >= bX1 && aY <= bY2 && aY2 >= bY1) {
            console.log(`${aX} < ${bX2} && ${aX2} > ${bX1} && ${aY} < ${bY2} && ${aY2} > ${bY1}`);
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
