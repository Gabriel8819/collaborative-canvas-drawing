export default class CommandHistory{
    constructor(size){
        this.size = size;
        this.commands = [];
        this.currentCommand = 0;
    }

    undo(){
        if(this.currentCommand < 1) return null;
        this.currentCommand -= 1;
        return this.commands[this.currentCommand];
    }

    redo(){
        if(this.currentCommand >= this.commands.length-1) return null;
        this.currentCommand += 1;
        return this.commands[this.currentCommand];
    }

    addCommand(command){
        if(this.currentCommand < this.commands.length-1) this.commands.splice(this.currentCommand+1, this.commands.length);
        if(this.commands.length >= this.size) this.commands.splice(0, 1);
        this.commands.push(command);
        this.setCurrentCommand();
    }
    

    removeCommand(){
        this.commands.pop();
        this.setCurrentCommand();
    }


    setCurrentCommand(){
        // console.log(this.currentCommand, this.commands.length)
        this.currentCommand = this.commands.length - 1;
    }
 

    




}