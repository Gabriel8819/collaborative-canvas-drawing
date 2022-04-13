import Tools from "./Tools.js";



export default class CanvasState{


    constructor(){
        this.currentTool = Tools.PEN;
        this.lastToolIndex = 0;
        this.color = "#000";
        this.backgroundColor = "#fff";
        this.lastToolIndex = 0;
        this.firstClick = false;
        this.size = 10;
        this.pos = {x:0, y:0}
        this.isDrawing = false;
        this.canvasData;
    }
}