import {isNumber, isBetween} from "../utils/utils.js";

export default class Menu{


    constructor(canvasState){
        this.canvasState = canvasState;
    }

    init(ctx, canvas, menuButton, mainMenu, icons, colorInput, blankPageButton, hardDriveButton,sizeSlider, sizeNumber){
        this.showMenuEvent(menuButton, mainMenu);
        this.setIconEvents(icons);
        this.setColor(colorInput)
        this.eraseCanvas(blankPageButton, ctx, canvas)
        this.saveCanvasToDisk(hardDriveButton, canvas)
        this.setToolSizeEvents(sizeSlider, sizeNumber);
    }

    showMenuEvent(menuButton, mainMenu){
        menuButton.addEventListener("click", (e)=>{
            e.stopPropagation();
            let isMenuOpen = !menuButton.checked
        
            if(isMenuOpen){
                mainMenu.style.display = "";
            }else{
                mainMenu.style.display = "block";
            }
        });
    }

    setIconEvents(icons){
        icons.forEach((icon, i)=>{
            if(i === 0) {
                this.canvasState.currentTool = Number(icon.dataset.tool);
                icon.classList.add("selected-icon");
                this.canvasState.lastToolIndex = i;
            }
            icon.addEventListener("click", (e)=>{
                let index = i;
                icons[this.canvasState.lastToolIndex].classList.remove("selected-icon");
                icon.classList.add("selected-icon");
        
                this.canvasState.currentTool = Number(icon.dataset.tool);
                this.canvasState.lastToolIndex = index;
            });
        });
    }
    
    setColor(colorInput){
        colorInput.addEventListener("input", (e)=>{
            color = e.target.value;
        });
    }

    eraseCanvas(blankPageButton, ctx, canvas){
        blankPageButton.addEventListener("click", ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }

    saveCanvasToDisk(hardDriveButton, canvas){
        hardDriveButton.addEventListener("click", (e)=>{
            let data = canvas.toDataURL("image/jpg");
            let link = document.createElement("a");
            link.href = data;
            link.download = "filename.jpg";
            link.click();
        });
    }


    setToolSizeEvents(sizeSlider, sizeNumber){
        sizeSlider.addEventListener("input", (e)=>{
            let value = e.target.valueAsNumber;
            this.canvasState.size = sizeNumber.value = value;
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
            if(value === "") {e.target.value = sizeSlider.value = this.canvasState.size; return;}
            this.canvasState.size = e.target.value = sizeSlider.value = isBetween(value, 0, 400);
        });
    }

    closeMenu(menuButton, mainMenu){
        let isMenuOpen = menuButton.checked;

        if(isMenuOpen) {
            mainMenu.style.display = "";
            menuButton.checked = false;
        }
    }




}