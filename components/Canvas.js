import Tools from "./Tools.js";
import { isShapeTools, isToolPresent, cursorPosition } from "../utils/utils.js";
import {radius} from "../utils/math.js";


export default class Canvas{

    constructor(canvas, canvasState, menu){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvasState = canvasState;
        this.menu = menu;
        
    }


    init(menuButton, mainMenu, icons, colorInput, blankPageButton, hardDriveButton, sizeSlider, sizeNumber){
        this.menu.init(this.ctx, this.canvas, menuButton, mainMenu, icons, colorInput, blankPageButton, hardDriveButton, sizeSlider, sizeNumber);
        this.setCanvasBackground();
        this.fitCanvasToWindow();

        let canvasMouseDown = (e)=>{
            return this.canvasMouseDown.call(this, e, menuButton, mainMenu);
        }

        this.canvas.addEventListener("mousedown", canvasMouseDown);
        this.canvas.addEventListener("mouseup", this.canvasMouseUp.bind(this));
        this.canvas.addEventListener("mousemove", this.canvasMouseDrag.bind(this));
        
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
            if(!touches) this.drawCircle(this.canvasState.size/2, true, false);
        }
        this.ctx.beginPath();
        this.canvasState.isDrawing = true;
    }

    canvasMouseUp(e){
        if(isShapeTools(this.canvasState.currentTool, Tools) && this.canvasState.firstClick) return;
        this.canvasState.isDrawing = false;
    }  

    canvasMouseDrag(e){
        let touches = e.touches;
    
        let endPos
        let {x, y} = endPos =  cursorPosition(e);
        // let ctrlKey = e.ctrlKey;
        
        if(touches && touches.length === 1){
            e.preventDefault();
        }else if (touches && touches.length > 1) {
            return;
        }
    
        if(!this.canvasState.isDrawing || this.canvasState.size == 0) return;
        if(isShapeTools(this.canvasState.currentTool, Tools)) this.ctx.putImageData(this.canvasState.canvasData, 0,0);
        
        switch(this.canvasState.currentTool){
            case Tools.PEN:
            case Tools.ERASER:
                this.ctx.lineTo(x, y);
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
                // let circle = {
                //     x:0,
                //     y:0
                // }
                // if(ctrlKey){
                //     console.log(ctrlKey)
                //     circle.x = this.pos.x; 
                //     circle.y = this.pos.y;
                // }else{
                //     circle.x = this.pos.x + (x - this.pos.x) / 2;
                //     circle.y = this.pos.y + (y - this.pos.y) / 2;
                //     hypotenuse = hypotenuse / 2;;
                // }
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
        // let circle = dragFromCenter(initPos, pos, fromCenter)
        // console.log(pos)
        this.ctx.beginPath();
        this.ctx.arc(this.canvasState.pos.x, this.canvasState.pos.y, radius, 0, Math.PI*2);
        if(fill) this.ctx.fill();
        if(stroke) this.ctx.stroke();
        this.ctx.closePath();
    }

}