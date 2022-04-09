
let menu = document.querySelector("div#menu");
// let sizeSlider = document.querySelector("#size-slider");
// let sizeNumber = document.querySelector("#size-number");

let size = 100;
// sizeNumber.value = size;



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
// ctx.fillStyle = "grey"
// ctx.fillRect(0, 0, canvas.width, canvas.height)
//To delete


window.addEventListener("wheel", (e)=>{
    if(e.ctrlKey === true) e.preventDefault()
}, {passive: false})


window.addEventListener("resize", (e)=>{
    canvasData = ctx.getImageData(0 , 0, canvas.width, canvas.height);
    resizeCanvas();
    //To delete
    // ctx.fillStyle = "grey";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    //to delete
    ctx.putImageData(canvasData, 0 , 0);
})


canvas.addEventListener("mousedown", canvasMouseDown)

canvas.addEventListener("mouseup", canvasMouseUp)

canvas.addEventListener("mousemove", canvasMouseDrag)  





function resizeCanvas(){
    if(window.innerWidth > canvas.width || window.innerHeight > canvas.height){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}


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
    if(!isDrawing || size == 0) return;
    console.log(size)

    let scrollX = window.scrollX;
    let scrollY = window.scrollY;
    let x = scrollX + e.clientX;
    let y = scrollY + e.clientY;

    ctx.fillStyle = "black";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = size;
    ctx.lineTo(x, y);
    ctx.stroke();
}






//menu


// sizeSlider.addEventListener("input", (e)=>{
//     let value = e.target.valueAsNumber

//     size = value;
//     sizeNumber.value = value
//     console.log(size)

// })


document.addEventListener("mousemove", (e)=>{
    let x = e.clientX;
    let y = e.clientY;

    if(y < 80){
        menu.style.top = "0px";
    }else{
        menu.style.top = "-40px";
    }

})





