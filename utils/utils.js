
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



