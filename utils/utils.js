export function isNumber(value){
    let code = value;
    let check = /\d/.test(code);
    return check;
}

export function isBetween(number, min, max){
    if(number < 0) return min;
    if(number > 800) return max;
    return number;
}

export function getRatio(from, to){
    return from/to;
}

export function isToolPresent(currentTool, tools){
    return tools.includes(currentTool);
}

export function isShapeTools(currentTool, tools){
    let shapeTools = [tools.LINE, tools.SQUARE, tools.CIRCLE, tools.PENTOOL];
    return isToolPresent(currentTool, shapeTools);
}

export function cursorPosition(e){
    let clientX = e.clientX || e.touches[0].clientX;
    let clientY = e.clientY || e.touches[0].clientY;
    let x = window.scrollX + clientX;
    let y = window.scrollY + clientY;
    return {
        x: x,
        y: y
    }
}