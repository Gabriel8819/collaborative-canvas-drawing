import {isNumber, isBetween, getRatio} from "./utils/utils.js";



let menuButton = document.querySelector("label[for=menu-button]");
let mainMenu = document.querySelector("div.main-menu");
let sizeSlider = document.querySelector("#size-slider");
let sizeNumber = document.querySelector("#size-number");
let sizeIcon = document.querySelector("span#size-icon");
let icons = document.querySelectorAll(".icon")
let colorInput = document.querySelector("input[type=color]")
let blankPageButton = document.querySelector("#blank-page-button");
let hardDriveButton = document.querySelector("#hard-drive")


let tools = {
    PEN: "pen",
    ERASER: "eraser",
    PENTOOL: "pen-tool",
    LINE: "line",
    SQUARE: "square",
    CIRCLE: "circle"
}

let currentTool = tools.PEN;
let color = "#000";
let backgroundColor = "#fff";
let lastToolIndex = 0;
let firstClick = false;
let size = sizeNumber.value = sizeSlider.value = 10;

let canvas = document.querySelector("canvas");
let ctx= canvas.getContext("2d");


let pos = {
    x: 0,
    y: 0
}

let canvasData;
let isDrawing = false;

resizeCanvas();


ctx.fillStyle = "white"
ctx.fillRect(0, 0, canvas.width, canvas.height)



window.addEventListener("wheel", (e)=>{
    if(e.ctrlKey === true) e.preventDefault()
}, {passive: false})


window.addEventListener("resize", (e)=>{
    canvasData = ctx.getImageData(0 , 0, canvas.width, canvas.height);
    resizeCanvas();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let scrollX = window.scrollX;
    let scrollY = window.scrollY;
    let x = scrollX + e.clientX;
    let y = scrollY + e.clientY;

    pos = {x, y};

    let isMenuOpen = menuButton.dataset.isOpen;
    if(isMenuOpen === "true") {
        mainMenu.style.display = "";
        menuButton.dataset.isOpen = "false";
    }

    ctx.strokeStyle = currentTool === "eraser" ? backgroundColor : color;
    ctx.fillStyle = currentTool === "eraser" ? backgroundColor : color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = size;

    if(currentTool ==  "line" || currentTool === "square" || currentTool === "circle" || currentTool === "pen-tool"){
        if(currentTool === "pen-tool" && firstClick && !(e.ctrlKey)) return;
        firstClick = !firstClick;
    }else{
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size/2, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
   
    
    ctx.beginPath();

    isDrawing = true;
}


function canvasMouseUp(e){
    if((currentTool === "line" || currentTool === "square" || currentTool === "circle" || currentTool === "pen-tool") && firstClick) return;
    isDrawing = false;
}  

function canvasMouseDrag(e){
    let ctrlKey = e.ctrlKey;
   
    if(!isDrawing || size == 0) return;

    let scrollX = window.scrollX;
    let scrollY = window.scrollY;
    let x = scrollX + e.clientX;
    let y = scrollY + e.clientY;



    switch(currentTool){
        case "pen":
        case "eraser":
            ctx.lineTo(x, y);
            ctx.stroke();
            break;
        case "line":
            ctx.putImageData(canvasData, 0,0);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(x, y);
            ctx.stroke()
            ctx.closePath();
            break;
        case "square":
            ctx.putImageData(canvasData, 0,0);
            ctx.beginPath();
            ctx.lineJoin = "miter";
            ctx.rect(pos.x, pos.y, x - pos.x, y - pos.y);
            ctx.stroke()
            ctx.closePath();
            break;
        case "circle":
            let hypotenuse = Math.sqrt((x - pos.x) ** 2 + (y - pos.y)**2);
            let distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y)**2);
            let circleX;
            let circleY;
            if(ctrlKey){
                circleX = pos.x 
                circleY = pos.y
            }else{
                circleX = pos.x + (x - pos.x) / 2
                circleY = pos.y + (y - pos.y) / 2
                hypotenuse = hypotenuse / 2;
            }
            ctx.putImageData(canvasData, 0,0);
            ctx.beginPath();
            ctx.arc(circleX, circleY, hypotenuse, 0, Math.PI*2);
            ctx.stroke();
            ctx.closePath();
            break;
        case "pen-tool":
            ctx.putImageData(canvasData, 0,0);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(x, y);
            ctx.stroke()
            ctx.closePath()
            break;
    
    }

   

    








}



let menubtn = document.querySelector("#menu-button")

console.log(document.querySelector("input#menu-button"))


//menu
console.log(menuButton)
menubtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    let isMenuOpen = !menubtn.checked

    if(isMenuOpen){
        mainMenu.style.display = "";
    }else{
        mainMenu.style.display = "block";
    }
})


//icon
icons.forEach((icon, i)=>{
    if(i === 0) {
        currentTool = icon.dataset.tool;
        icon.classList.add("selected-icon");
        lastToolIndex = i;
    }
    icon.addEventListener("click", function(e){
        let index = i;
        icons[lastToolIndex].classList.remove("selected-icon")
        icon.classList.add("selected-icon");

        currentTool = this.dataset.tool;
        lastToolIndex = index;
    })
});


colorInput.addEventListener("input", (e)=>{
    let colorValue = color = e.target.value;
});



blankPageButton.addEventListener("click", ()=>{
    // let answer = window.confirm("Do you really want to erase the canvas?");
    // if(answer) 
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
    let value = e.target.valueAsNumber
    sizeNumber.value = size = value
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


//Global events

document.addEventListener("keydown", (e)=>{

})


document.addEventListener("click", (e)=>{


})




document.addEventListener("mousemove", (e)=>{
    
});







//test

// ctx.rotate( 45 * (Math.PI / 180))


let points = [
    {type: "line", coord: {x:200, y: 200}},
    {type: "line", coord: {x:200, y:600}},
    {type: "bezier", coord: {x:600, y: 600, a1:200, b1:800, a2:600, b2:800}},
]

let selectedCoord;


canvas.addEventListener("mousedown", (e)=>{

    let x = e.clientX;
    let y = e.clientY;

    // console.log(x, y )

    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.putImageData(canvasData, 0, 0);
    

    points.forEach((point, index)=>{
        if(Math.abs(x - point.coord.x) < 10 && Math.abs(y - point.coord.y) < 10){
            console.log(index)
            let prev = index-1;
            let next = index+1;

            console.log(points[next], next)
            
            if(points[prev]!= null) {
                
            }
            if(points[next]!= null) {

            }


            let pt = point.coord;
            
            ctx.beginPath()
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2)
            ctx.stroke();
            ctx.closePath();
        }

    });


    // 

})





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























//  clear
// redo undo
//tooltips


















