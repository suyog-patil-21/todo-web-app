const TODO_KEY_LOCAL = "todo-list-key";

class TodoManager {
  constructor(tasks = []) {
    this.tasks = tasks;
  }

  get todosList() {
    return this.tasks;
  }

  deleteTask(id) {
    // if (index > this.tasks.length && index < 0) return;
    this.tasks = this.tasks.filter((val) => val.id != id);
    localStorage.setItem(TODO_KEY_LOCAL, JSON.stringify(this.tasks));
  }

  addTask(task) {
    // if (this.todo.includes(task)) return;
    this.tasks.push(task);
    localStorage.setItem(TODO_KEY_LOCAL, JSON.stringify(this.tasks));
  }

  markDone(id){
    this.tasks = this.tasks.map((el)=>{
      if(el.id == id){
        return {
          ...el,
          isDone:!el.isDone
        } 
      }
      return el;
    });
    localStorage.setItem(TODO_KEY_LOCAL, JSON.stringify(this.tasks));
  }

  clearTask() {
    this.tasks = [];
    localStorage.clear();
  }
}

const inputTitle = document.getElementById("inputTitle");
const inputDesc = document.getElementById("inputdesc");
const addTaskBtn = document.getElementById("addTaskBtn");
const deleteAllTaskBtn = document.getElementById("deleteAllTaskBtn");
const todoslistEl = document.getElementById("todos-list");

let todoManger;
(function setupPage() {
  const localData = localStorage.getItem(TODO_KEY_LOCAL);
  if (localData) {
    let data = JSON.parse(localData);
    todoManger = new TodoManager(data);
  } else {
    todoManger = new TodoManager();
  }
  renderTodos(todoManger.todosList);
})();

addTaskBtn.addEventListener("click", function () {
  if (isEmpty(inputTitle.value)) return;
  const task = {
    id: Date.now(),
    title: clearInput(inputTitle.value),
    desc: clearInput(inputDesc.value),
    isDone: false,
  };
  todoManger.addTask(task);
  renderTodos(todoManger.todosList);
  inputTitle.value = "";
  inputDesc.value = "";
});

deleteAllTaskBtn.addEventListener("click", function () {
  todoManger.clearTask();
  renderTodos(todoManger.todosList);
});

function renderTodos(todos) {
  // todoslistEl.innerHTML = "";
  if (todos.length == 0) {
    todoslistEl.innerHTML = "<p>No items</p>";
    return;
  }
  let listcontent = "";
  for (let i = 0; i < todos.length; i++) {
    const div = `<div class="icon"> </div>`;

    const todoElement = `<li class="todo-item" onclick="markDone(${todos[i].id})">
    <div class="icon ${todos[i].isDone ? "iconTick" : ""}">${todos[i].isDone ? "&#10003" : " "}</div>
    <div class="item-content">
     <p class="item-title-content">${todos[i].title}</p>
     <p class="item-desc-content">${todos[i].desc}</p>
    </div>
    <div class="item-trailing">
    <button onclick="deleteTodo(${todos[i].id})">\u00d7</button> 
    <div>
    </li>`;
    listcontent += todoElement;
  }
  todoslistEl.innerHTML = listcontent;
}

function deleteTodo(id) {
  todoManger.deleteTask(id);
  renderTodos(todoManger.todosList);
}
function markDone(id) {
  todoManger.markDone(id);
  renderTodos(todoManger.todosList)
}

function clearInput(value) {
  return value.trim();
}

function isEmpty(value) {
  let val = clearInput(value);
  return val.length == 0;
}
