import Canvas from "./components/Canvas.js";
import Menu from "./components/Menu.js";
import CanvasState from "./components/CanvasState.js";

import CommandList from "./components/CommandHistory.js";
import CommandHistory from "./components/CommandHistory.js";

if(navigator.userAgent.toLowerCase().search("mobile") > -1){
    document.querySelector("#tool-icons").removeChild(document.querySelector(".pen-tool-icon"));
}


let menuButton = document.querySelector("#menu-button");
let mainMenu = document.querySelector("div.main-menu");
let sizeSlider = document.querySelector("#size-slider");
let sizeNumber = document.querySelector("#size-number");
let icons = document.querySelectorAll(".icon");
let colorInput = document.querySelector("input[type=color]");
let blankPageButton = document.querySelector("#blank-page-button");
let hardDriveButton = document.querySelector("#hard-drive");
let canvas = document.querySelector("canvas");


let canvasState = new CanvasState();
let menu = new Menu(canvasState);
let myCanvas = new Canvas(canvas, canvasState, menu);
myCanvas.init(menuButton, mainMenu, icons, colorInput, blankPageButton, hardDriveButton, sizeSlider, sizeNumber);

window.addEventListener("wheel", (e)=>{
    if(e.ctrlKey === true) e.preventDefault();
}, {passive: false});

window.addEventListener("resize", (e)=>{
    canvasState.canvasData = myCanvas.ctx.getImageData(0 , 0, canvas.width, canvas.height);
    myCanvas.fitCanvasToWindow(canvas);
    myCanvas.setCanvasBackground();
    myCanvas.ctx.putImageData(canvasState.canvasData, 0 , 0);
});








//================ todo ========================


//tooltips
//test suite
//tutorial
//oauth2
//locale












