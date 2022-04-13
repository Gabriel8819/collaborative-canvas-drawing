import Tools from "./Tools.js";
import { isShapeTools, isToolPresent, cursorPosition } from "../src/utils/utils.js";
import {radius} from "../src/utils/math.js";
import CommandHistory from "./CommandHistory.js";
import Command from "./Command.js";


export default class Canvas{

    constructor(canvas, canvasState, menu){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingQuality = "low"
        this.ctx.imageSmoothingEnabled = false;
        this.canvasState = canvasState;
        this.menu = menu;
        this.commandHistory = new CommandHistory(40, this.ctx);
    }

    init(menuButton, mainMenu, icons, colorInput, blankPageButton, hardDriveButton, sizeSlider, sizeNumber){
        this.setCanvasBackground();
        this.fitCanvasToWindow();
        this.menu.init(this.ctx, this.canvas, menuButton, mainMenu, icons, colorInput, blankPageButton, hardDriveButton, sizeSlider, sizeNumber);
        this.commandHistory.addCommand(new Command(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)));
        
        document.addEventListener("keyup", this.navigateCommandsHistory.bind(this));
        
        let canvasMouseDown = (e)=> this.canvasMouseDown.call(this, e, menuButton, mainMenu);
        this.canvas.addEventListener("mousedown", canvasMouseDown);
        this.canvas.addEventListener("mouseup", this.canvasMouseUp.bind(this));
        this.canvas.addEventListener("mousemove", this.canvasMouseDrag.bind(this));
        this.canvas.addEventListener("mouseout", this.canvasMouseUp.bind(this))
        
        this.canvas.addEventListener("touchstart", canvasMouseDown);
        this.canvas.addEventListener("touchend", this.canvasMouseUp.bind(this));
        this.canvas.addEventListener("touchmove", this.canvasMouseDrag.bind(this), {passive: false});
    }

    setCanvasBackground(){
        this.ctx.fillStyle = this.canvasState.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    fitCanvasToWindow(){
        if(window.innerWidth > this.canvas.width || window.innerHeight > this.canvas.height){
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    setToolStyle(){
        this.ctx.strokeStyle = this.canvasState.currentTool === Tools.ERASER ? this.canvasState.backgroundColor : this.canvasState.color;
        this.ctx.fillStyle = this.canvasState.currentTool === Tools.ERASER ? this.canvasState.backgroundColor : this.canvasState.color;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = this.canvasState.size;
    }

    canvasMouseDown(e, menuButton, mainMenu){
        
        let touches = e.touches;
        this.canvasState.canvasData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let {x, y} = cursorPosition(e);
        this.canvasState.pos = {x, y};
        this.menu.closeMenu(menuButton, mainMenu);
        this.setToolStyle();
        
        if(isToolPresent(this.canvasState.currentTool, [Tools.PENTOOL])){
            if(this.canvasState.currentTool === Tools.PENTOOL && this.canvasState.firstClick && !(e.ctrlKey)) return;
            this.canvasState.firstClick = !this.canvasState.firstClick;
        }else{
            // if(!touches) this.drawCircle(this.canvasState.size/2, true, false);
        }
        
        this.ctx.beginPath();
        this.canvasState.isDrawing = true;
    }

    canvasMouseUp(e){
        if(isShapeTools(this.canvasState.currentTool, Tools) && this.canvasState.firstClick) return;
        if(this.canvasState.isDrawing !== false) this.commandHistory.addCommand(new Command(this.getCanvasData(0,0,this.canvas.width, this.canvas.height)));
        this.canvasState.isDrawing = false;
        
    }  

    canvasMouseDrag(e){
        let touches = e.touches;
        let endPos =  cursorPosition(e);
        
        //Mobile: check if drag with more than 1 finger.
        if(touches && touches.length === 1){
            e.preventDefault();
        }else if (touches && touches.length > 1) {
            return;
        }
    
        if(!this.canvasState.isDrawing || this.canvasState.size == 0) return;
        if(isShapeTools(this.canvasState.currentTool, Tools)) this.ctx.putImageData(this.canvasState.canvasData, 0,0);

        this.draw(endPos);
    }


    draw(endPos){
        
        switch(this.canvasState.currentTool){
            case Tools.PEN:
            case Tools.ERASER:
                this.ctx.lineTo(endPos.x, endPos.y);
                this.ctx.stroke();
                break;
            case Tools.LINE:
                this.drawLine(this.canvasState.pos, endPos);
                break;
            case Tools.SQUARE:
                this.drawSquare(endPos, false, true);
                break;
            case Tools.CIRCLE:
                let hypotenuse = radius(this.canvasState.pos, endPos);
                this.drawCircle(hypotenuse, false, true);
                break;
            case Tools.PENTOOL:
                this.drawLine(this.canvasState.pos, endPos);
                break;
        }
    }


    drawLine(startPos, endPos){
        this.ctx.beginPath();
        this.ctx.moveTo(startPos.x, startPos.y);
        this.ctx.lineTo(endPos.x, endPos.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    
    drawSquare(endPos, fill, stroke){
        this.ctx.beginPath();
        this.ctx.lineJoin = "miter";
        this.ctx.rect(this.canvasState.pos.x, this.canvasState.pos.y, endPos.x - this.canvasState.pos.x, endPos.y - this.canvasState.pos.y);
        if(fill)this.ctx.fill();
        if(stroke)this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCircle(radius, fill, stroke, fromCenter){
        this.ctx.beginPath();
        this.ctx.arc(this.canvasState.pos.x, this.canvasState.pos.y, radius, 0, Math.PI*2);
        if(fill) this.ctx.fill();
        if(stroke) this.ctx.stroke();
        this.ctx.closePath();
    }


    getCanvasData(x, y, width, height){
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }


    navigateCommandsHistory(e){
        let isCtrlPressed = e.ctrlKey;
        let key = e.key.toLowerCase()
        let data = null;
        if(!isCtrlPressed) return;
        switch(key){
            case "z":
                data = this.commandHistory.undo()?.data;
                if(data){
                    this.ctx.putImageData(data, 0, 0);
                }
                break;
            case "x":
                data = this.commandHistory.redo()?.data;
                if(data){
                    this.ctx.putImageData(data, 0, 0)
                }
                break;
        }
        data = null;
    }

}