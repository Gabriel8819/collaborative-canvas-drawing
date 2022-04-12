import {isNumber, isBetween, getRatio} from "./utils/utils.js";
import {
    fitCanvasToWindow, 
    setCanvasBackground,
    isShapeTools,
    isToolPresent,
    drawCircle,
    drawLine,
    drawSquare,
    cursorPosition,
    hypothenuse
} from "./Canvas.js";

import Menu from "./Menu.js";
import CanvasState from "./CanvasState.js";


if(navigator.userAgent.toLowerCase().search("mobile") > -1){
    document.querySelector("#tool-icons").removeChild(document.querySelector(".pen-tool-icon"));
}


let menuButton = document.querySelector("#menu-button");
let mainMenu = document.querySelector("div.main-menu");
let sizeSlider = document.querySelector("#size-slider");
let sizeNumber = document.querySelector("#size-number");
let sizeIcon = document.querySelector("span#size-icon");
let icons = document.querySelectorAll(".icon")
let colorInput = document.querySelector("input[type=color]")
let blankPageButton = document.querySelector("#blank-page-button");
let hardDriveButton = document.querySelector("#hard-drive")




let canvas = document.querySelector("canvas");
let ctx= canvas.getContext("2d");


let tools = {
    PEN: 0,
    ERASER: 1,
    LINE: 2,
    SQUARE: 3,
    CIRCLE: 4,
    PENTOOL: 5
}


//State Object
let currentTool = tools.PEN;
let color = "#000";
let backgroundColor = "#fff";
let lastToolIndex = 0;
let firstClick = false;
let size = sizeNumber.value = sizeSlider.value = 10;

let pos = {
    x: 0,
    y: 0
}

let canvasData;
let isDrawing = false;


let canvasState = new CanvasState();
let menu = new Menu(canvasState);
menu.init(ctx, canvas, menuButton, mainMenu, icons, colorInput, blankPageButton, hardDriveButton, sizeSlider, sizeNumber);





//Init
fitCanvasToWindow(canvas);
setCanvasBackground(canvas, ctx);


window.addEventListener("wheel", (e)=>{
    if(e.ctrlKey === true) e.preventDefault()
}, {passive: false})


window.addEventListener("resize", (e)=>{
    canvasData = ctx.getImageData(0 , 0, canvas.width, canvas.height);
    fitCanvasToWindow(canvas);
    setCanvasBackground(canvas, ctx);
    ctx.putImageData(canvasData, 0 , 0);
});


canvas.addEventListener("mousedown", canvasMouseDown)
canvas.addEventListener("mouseup", canvasMouseUp)
canvas.addEventListener("mousemove", canvasMouseDrag)  

canvas.addEventListener("touchstart", canvasMouseDown)
canvas.addEventListener("touchend", canvasMouseUp)
canvas.addEventListener("touchmove", canvasMouseDrag, {passive: false})


function canvasMouseDown(e){
    let touches = e.touches;
    canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let {x, y} = cursorPosition(e);

    pos = {x, y};

    menu.closeMenu(menuButton, mainMenu)

    ctx.strokeStyle = currentTool === tools.ERASER ? backgroundColor : color;
    ctx.fillStyle = currentTool === tools.ERASER ? backgroundColor : color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = size;

    if(isToolPresent(currentTool, [tools.PENTOOL])){
        if(currentTool === tools.PENTOOL && firstClick && !(e.ctrlKey)) return;
        firstClick = !firstClick;
    }else{
        if(!touches) drawCircle(ctx, pos, size/2, true, false);
    }
    ctx.beginPath();
    isDrawing = true;
}


function canvasMouseUp(e){
    if(isShapeTools(currentTool, tools) && firstClick) return;
    isDrawing = false;
}  

function canvasMouseDrag(e){
    let touches = e.touches;

    let {x, y} = cursorPosition(e);
    let ctrlKey = e.ctrlKey;
    
    if(touches && touches.length === 1){
        e.preventDefault();
    }else if (touches && touches.length > 1) {
        return;
    }

    if(!isDrawing || size == 0) return;
    if(isShapeTools(currentTool, tools)) ctx.putImageData(canvasData, 0,0);
    
    switch(currentTool){
        case tools.PEN:
        case tools.ERASER:
            ctx.lineTo(x, y);
            ctx.stroke();
            break;
        case tools.LINE:
            drawLine(ctx, pos, {x,y})
            break;
        case tools.SQUARE:
            drawSquare(ctx, pos, {x,y}, false, true);
            break;
        case tools.CIRCLE:
            let hypotenuse = hypothenuse(pos.x, pos.y, x, y);
            // let circle = {
            //     x:0,
            //     y:0
            // }
            // if(ctrlKey){
            //     console.log(ctrlKey)
            //     circle.x = pos.x; 
            //     circle.y = pos.y;
            // }else{
            //     circle.x = pos.x + (x - pos.x) / 2;
            //     circle.y = pos.y + (y - pos.y) / 2;
            //     hypotenuse = hypotenuse / 2;;
            // }
            drawCircle(ctx, pos, hypotenuse, false, true);
            break;
        case tools.PENTOOL:
            drawLine(ctx, pos, {x,y});
            break;
    
    }
}


//Menu init ========================================
//menu
menuButton.addEventListener("click", (e)=>{
    e.stopPropagation();
    let isMenuOpen = !menuButton.checked

    if(isMenuOpen){
        mainMenu.style.display = "";
    }else{
        mainMenu.style.display = "block";
    }
})


//icon
icons.forEach((icon, i)=>{
    if(i === 0) {
        currentTool = Number(icon.dataset.tool);
        icon.classList.add("selected-icon");
        lastToolIndex = i;
    }
    icon.addEventListener("click", function(e){
        let index = i;
        icons[lastToolIndex].classList.remove("selected-icon");
        icon.classList.add("selected-icon");

        currentTool = Number(this.dataset.tool);
        lastToolIndex = index;
    })
});



colorInput.addEventListener("input", (e)=>{
    color = e.target.value;
});


blankPageButton.addEventListener("click", ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});



hardDriveButton.addEventListener("click", (e)=>{
    let data = canvas.toDataURL("image/jpg");
    let link = document.createElement("a");
    link.href = data;
    link.download = "filename.jpg";
    link.click();
});



//Slider Events
sizeSlider.addEventListener("input", (e)=>{
    let value = e.target.valueAsNumber;
    sizeNumber.value = size = value;
});

sizeNumber.addEventListener("keydown", (e)=>{
    let value = e.key;
    if(!isNumber(value) && value != "Backspace"){
        e.preventDefault();
        return;
    }
});

sizeNumber.addEventListener("blur", (e)=>{
    let value = e.target.value;
    if(value === "") {e.target.value = sizeSlider.value = size; return;}
    e.target.value = size = sizeSlider.value = isBetween(value, 0, 400);
});



























//=============================================================

//test

// ctx.rotate( 45 * (Math.PI / 180))


// let points = [
//     {type: "line", coord: {x:200, y: 200}},
//     {type: "line", coord: {x:200, y:600}},
//     {type: "bezier", coord: {x:600, y: 600, a1:200, b1:800, a2:600, b2:800}},
// ]

// let selectedCoord;


// canvas.addEventListener("mousedown", (e)=>{

//     let x = e.clientX;
//     let y = e.clientY;

//     // console.log(x, y )

//     ctx.clearRect(0,0,canvas.width, canvas.height)
//     ctx.putImageData(canvasData, 0, 0);
    

//     points.forEach((point, index)=>{
//         if(Math.abs(x - point.coord.x) < 10 && Math.abs(y - point.coord.y) < 10){
//             console.log(index)
//             let prev = index-1;
//             let next = index+1;

//             console.log(points[next], next)
            
//             if(points[prev]!= null) {
                
//             }
//             if(points[next]!= null) {

//             }


//             let pt = point.coord;
            
//             ctx.beginPath()
//             ctx.lineWidth = 2;
//             ctx.strokeStyle = "red";
//             ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2)
//             ctx.stroke();
//             ctx.closePath();
//         }

//     });
// });





// ctx.beginPath();
// ctx.lineWidth = 20
// ctx.lineCap = "round"



// ctx.moveTo(200, 200)
// ctx.lineTo(200, 600)
// ctx.bezierCurveTo(200 ,600 , 200, 800, 600, 600);
// ctx.stroke();

// ctx.closePath();
// ctx.closePath();

// ctx.beginPath();
// ctx.lineWidth = 10;
// ctx.moveTo(200, 600);
// ctx.lineTo(200, 800);
// ctx.stroke();
// ctx.closePath();

// ctx.beginPath();
// ctx.lineWidth = 10;
// ctx.arc(200, 800, 10, 0, Math.PI * 2);
// ctx.fill();
// ctx.closePath();

// canvasData = ctx.getImageData(0,0, canvas.width, canvas.height);




// ctx.quadraticCurveTo(400, 400, 600, 600);





















//remove file git
// redo undo
//tooltips
//refactor
// mobile 
//test suite
//cross browser
















