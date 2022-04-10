import {isNumber, isBetween, getRatio} from "./utils/utils.js";



let menuButton = document.querySelector("div#menu-button");
let mainMenu = document.querySelector("div.main-menu");
let sizeSlider = document.querySelector("#size-slider");
let sizeNumber = document.querySelector("#size-number");
let sizeIcon = document.querySelector("span#size-icon");
let icons = document.querySelectorAll(".icon")


let tools = {
    PEN: "pen",
    ERASER: "eraser",
    PENTOOL: "pen-tool",
    LINE: "line",
    SQUARE: "square",
    CIRLCE: "circle"
}

let currentTool = tools.PEN;
let lastToolIndex = 0;
let size = sizeNumber.value = sizeSlider.value = 100;

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
    let scrollX = window.scrollX;
    let scrollY = window.scrollY;
    let x = scrollX + e.clientX;
    let y = scrollY + e.clientY;

    pos = {x, y};

    console.log(pos)

    let isMenuOpen = menuButton.dataset.isOpen;
    if(isMenuOpen === "true") {
        mainMenu.style.display = "";
        menuButton.dataset.isOpen = "false";
    }
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

    let scrollX = window.scrollX;
    let scrollY = window.scrollY;
    let x = scrollX + e.clientX;
    let y = scrollY + e.clientY;

    ctx.fillStyle = "black";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = size;
    // ctx.lineTo(x, y);
    // ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    


    ctx.lineTo(x, y);
    ctx.closePath();



}






//menu
menuButton.addEventListener("click", (e)=>{
    e.stopPropagation();
    let isMenuOpen = menuButton.dataset.isOpen;

    if(isMenuOpen == "true"){
        mainMenu.style.display = "";
        menuButton.dataset.isOpen = "false";
    }else{
        menuButton.dataset.isOpen = "true";
        mainMenu.style.display = "block";
    }

})


//icon
icons.forEach((icon, i)=>{
    if(i === 0) {
        currentTool =icon.dataset.tool;
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
})





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

// sizeNumber.addEventListener("keyup", (e)=>{
//     let value = e.target.value;
// });

sizeNumber.addEventListener("blur", (e)=>{
    let value = e.target.value;
    if(value === "") {e.target.value = sizeSlider.value = size; return;}
    e.target.value = size = sizeSlider.value = isBetween(value, 0, 800);
});









//Global events

document.addEventListener("click", (e)=>{


})




document.addEventListener("mousemove", (e)=>{
    
    // let x = e.clientX;
    // let y = e.clientY;

    // if(y < 80){
    //     menu.style.top = "0px";
    // }else{
    //     menu.style.top = "-50px";
    // }

});







//test

// ctx.rotate( 45 * (Math.PI / 180))







// ctx.beginPath();
// ctx.lineWidth = 50
// ctx.lineCap = "round"

// ctx.lineTo(200, 200)
// ctx.lineTo(400, 400)
// ctx.stroke();


// ctx.closePath();
// ctx.closePath();



// // let data = ctx.getImageData(0,0, canvas.width, canvas.height);



// ;

// ctx.restore();

// ctx.beginPath();
// ctx.lineWidth = 50
// ctx.lineCap = "round"

// ctx.lineTo(600, 600)

// ctx.closePath()

// // ctx.beginPath();
// // ctx.clearRect(0,0, canvas.width, canvas.height)
// // ctx.putImageData(data, 0, 0 )


// ctx.lineTo(200, 800)


// // ctx.clearRect(0,0, canvas.width, canvas.height)
// // ctx.putImageData(data, 0, 0 )


// ctx.lineTo(400, 800)
// ctx.stroke();




// ctx.closePath();

















