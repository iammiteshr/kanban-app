let root = document.getElementById("root");

class todoList{
    constructor(place, title){
        this.place = place;
        this.title = title;
        this.cardArray = [];
        this.render();
    }

    addToDo(){
        let text = this.input.value;
        this.cardArray.push(new Card(text, this.div, this));
    }

    render(){
        this.createToDoListElement();
        this.place.append(this.todoListElement);
    }

    createToDoListElement(){
        //Create elements
        this.h2 = document.createElement('h2');
        this.h2.innerText = this.title;
        this.input = document.createElement('input');
        this.input.classList.add("comment");
        this.button = document.createElement('button');
        this.button.innerText = 'Add';
        this.button.classList.add("btn-save");
        this.button.id = "to-do-list-button";
        this.div = document.createElement('div');
        this.todoListElement = document.createElement('div');

        //Add Event listener
        this.button.addEventListener('click', ()=>{
            if(this.input.value != ""){
                this.addToDo.call(this);
                this.input.value = "";
            }
        });

        //Append elements to the to-do list element
        this.todoListElement.append(this.h2);
        this.todoListElement.append(this.input);
        this.todoListElement.append(this.button);
        this.todoListElement.append(this.div);
        this.todoListElement.classList.add("todoList");

        this.todoListElement.addEventListener('drop', (e)=>{
            drop(e)
        })

        this.todoListElement.addEventListener('dragover', (e)=>{
            allowDrop(e)
        })
    }
}

class Card{
    constructor(text, place, todoList){
        this.place = place;
        this.todoList = todoList;
        this.state = {
            text: text,
            description: "Click to write a description...",
            time:  new Date().toLocaleString()
        }
        this.render();
    }

    render(){
        this.card = document.createElement('div');
        this.card.classList.add("card");
        this.card.setAttribute("id", this.state.text);

        this.card.addEventListener('click', (e)=>{
            if(e.target != this.deleteButton){
                this.showMenu.call(this);
            }
        });

        this.card.setAttribute("draggable", "true");
        this.card.addEventListener('dragstart', (e)=>{
            drag(e)
        });
        
        this.p = document.createElement('p');
        this.p.innerText = this.state.text;

        this.deleteButton = document.createElement('button');
        this.deleteButton.innerText = "X";
        this.deleteButton.addEventListener('click', ()=>{
            this.deleteCard.call(this);
        });

        this.card.append(this.p);
        this.card.append(this.deleteButton);
        
        this.place.append(this.card);
    }

    deleteCard(){
        this.card.remove();
        let i = this.todoList.cardArray.indexOf(this);
        this.todoList.cardArray.splice(i,1);
    }

    showMenu(){

        //Create elements
        this.menu = document.createElement("div");
        this.menuContainer = document.createElement("div");
        this.menuTitle = document.createElement("div");
        this.menuStatus = document.createElement("p");
        this.menuCreated = document.createElement("p");
        this.menuStatus.innerText = `Status: ${this.todoList.title}`;
        this.menuCreated.innerText = `Created at: ${this.state.time}`;
        this.menuDescription = document.createElement("div");


        //Add class names
        this.menu.className = "menu";
        this.menuContainer.className = "menuContainer";
        this.menuTitle.className = "menuTitle";
        this.menuDescription.className = "menuDescription";

        //Event listeners
        this.menuContainer.addEventListener('click', (e)=>{
            console.log(e.target);
            if(e.target.classList.contains("menuContainer")){
                this.menuContainer.remove();
            }
        });

        //Append
        this.menu.append(this.menuTitle);
        this.menu.append(this.menuStatus);
        this.menu.append(this.menuCreated);
        this.menu.append(document.createElement("br"));
        this.menu.append(this.menuDescription);
        this.menuContainer.append(this.menu);
        root.append(this.menuContainer);

        this.editableDescription = new EditableText(this.state.description, this.menuDescription, this, "description", "textarea");
        this.editableTitle = new EditableText(this.state.text, this.menuTitle, this, "text", "input");
    }
}

class EditableText{
    constructor(text, place, card, property, typeOfInput){
        this.text = text;
        this.place = place;
        this.card = card;
        this.property = property;
        this.typeOfInput = typeOfInput;
        this.render();
    }
    
    render(){
        console.log(this.card)
        this.div = document.createElement("div");
        this.p = document.createElement("p");

        this.p.innerText = this.text;

        this.p.addEventListener('click', ()=>{
            this.showEditableTextArea.call(this);
        });

        this.div.append(this.p);
        this.place.append(this.div);
    }

    showEditableTextArea(){
        let oldText = this.text;

        this.input = document.createElement(this.typeOfInput);
        this.saveButton = document.createElement("button");

        this.p.remove();
        this.input.value = oldText;
        this.saveButton.innerText = "Save";
        this.saveButton.className = "btn-save";
        this.input.classList.add("comment");

        this.saveButton.addEventListener('click', ()=>{
            this.text = this.input.value;
            this.card.state[this.property] = this.input.value;
            if(this.property == "text"){
                this.card.p.innerText = this.input.value;
            }
            this.div.remove();
            this.render();
        });

        function clickSaveButton(event, object){
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                object.saveButton.click();
            }
        }

        this.input.addEventListener("keyup", (e)=>{
            if(this.typeOfInput == "input"){
                clickSaveButton(e, this);
            }
        });

        this.div.append(this.input);

        if(this.typeOfInput == "textarea"){
            this.div.append(this.saveButton);
        }

        this.input.select();
    }

}


let addTodoListInput = document.getElementById("addTodoListInput");
let addTodoListButton = document.getElementById("addTodoListButton");

addTodoListButton.addEventListener('click',()=>{
    if ( addTodoListInput.value.trim() != ""){
        new todoList(root, addTodoListInput.value);
        addTodoListInput.value = "";
    }
});

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}

let todoList1 = new todoList(root, "To Do");
let todoList2 = new todoList(root, "Doing");
let todoList3 = new todoList(root, "Done");

todoList1.input.value = "1";
todoList1.addToDo();
todoList1.input.value = "2";
todoList1.addToDo();
todoList1.input.value = "";

todoList2.input.value = "3";
todoList2.addToDo();
todoList2.input.value = "4";
todoList2.addToDo();
todoList2.input.value = "";

todoList3.input.value = "5";
todoList3.addToDo();
todoList3.input.value = "6";
todoList3.addToDo();
todoList3.input.value = "";