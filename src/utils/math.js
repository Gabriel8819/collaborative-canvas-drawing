export function radius(pos1, pos2){
    return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y)**2);
}
