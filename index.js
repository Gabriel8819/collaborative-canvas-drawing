let canvas = document.querySelector("canvas");
let ctx= canvas.getContext("2d");


let pos = {
    x: 0,
    y: 0
}

let canvasData;

resizeCanvas();





ctx.fillStyle = "grey"
ctx.fillRect(0, 0, canvas.width, canvas.height)



window.addEventListener("wheel", (e)=>{
    if(e.ctrlKey === true) e.preventDefault()
    console.log("wheel", e.ctrlKey)
}, {passive: false})


window.addEventListener("resize", (e)=>{
    canvasData = ctx.getImageData(0 , 0, canvas.width, canvas.height);


    resizeCanvas();

    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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



function canvasMouseDown(e){
    ctx.beginPath();
    canvas.addEventListener("mousemove", canvasMouseDrag)  
}

function canvasMouseUp(e){
    ctx.closePath()
    canvas.removeEventListener("mousemove", canvasMouseDrag)
}

function canvasMouseDrag(e){
    let scrollX = window.scrollX;
    let scrollY = window.scrollY;

    let x = scrollX + e.clientX;
    let y = scrollY + e.clientY;

    console.log(x, y)

    ctx.fillStyle = "black";
   
    // ctx.arc(pos.x, pos.y, 10, 0, Math.PI*2);
    ctx.lineWidth = 40
    ctx.lineTo(x, y)
    // ctx.fill();
    ctx.stroke();
    
    
}


