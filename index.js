let canvas = document.querySelector("canvas");
let ctx= canvas.getContext("2d");


let pos = {
    x: 0,
    y: 0
}

let canvasData;
let isDrawing = false;

resizeCanvas();




//To delete
ctx.fillStyle = "grey"
ctx.fillRect(0, 0, canvas.width, canvas.height)
//To delete


window.addEventListener("wheel", (e)=>{
    if(e.ctrlKey === true) e.preventDefault()
}, {passive: false})


window.addEventListener("resize", (e)=>{
    canvasData = ctx.getImageData(0 , 0, canvas.width, canvas.height);
    resizeCanvas();
    //To delete
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //to delete
    ctx.putImageData(canvasData, 0 , 0);
})


canvas.addEventListener("mousedown", canvasMouseDown)


canvas.addEventListener("mouseup", canvasMouseUp)






function resizeCanvas(){
    if(window.innerWidth > canvas.width || window.innerHeight > canvas.height){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

canvas.addEventListener("mousemove", canvasMouseDrag)  

function canvasMouseDown(e){
    ctx.beginPath();
    isDrawing = true;
    // canvas.addEventListener("mousemove", canvasMouseDrag)  
}

function canvasMouseUp(e){
    ctx.closePath()
    isDrawing = false;
    // canvas.removeEventListener("mousemove", canvasMouseDrag)
}

function canvasMouseDrag(e){
    if(!isDrawing) return;

    let scrollX = window.scrollX;
    let scrollY = window.scrollY;
    let x = scrollX + e.clientX;
    let y = scrollY + e.clientY;

    ctx.fillStyle = "black";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 40;
    ctx.lineTo(x, y);
    ctx.stroke();
    
    
}


