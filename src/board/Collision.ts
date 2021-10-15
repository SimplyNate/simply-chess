import * as PIXI from 'pixi.js';

export function isColliding(dragNode: PIXI.Sprite, legalSpaces: PIXI.Sprite[], globalOffset: { x: number, y: number }): PIXI.Sprite[] {
    const collisions = [];
    const aX = dragNode.x - (dragNode.width);
    const aY = dragNode.y - (dragNode.height);
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
        if (aX < bX2 && aX2 > bX1 && aY < bY2 && aY2 > bY1) {
            collisions.push(place);
        }
    }
    return collisions;
}

export function getNearestCollision(collisions: PIXI.Sprite[], cX: number, cY: number, globalOffset: { x: number, y: number }): PIXI.Sprite {
    collisions.sort((a, b) => {
        const aCenter = {
            x: a.parent.x + globalOffset.x + (a.parent.width / 2),
            y: a.parent.y + globalOffset.y + (a.parent.height / 2),
        };
        const bCenter = {
            x: b.parent.x + globalOffset.x + (b.parent.width / 2),
            y: b.parent.y + globalOffset.y + (b.parent.height / 2),
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
        console.log(aHypotenuse, bHypotenuse);
        return aHypotenuse - bHypotenuse;
    });
    return collisions[0];
}
