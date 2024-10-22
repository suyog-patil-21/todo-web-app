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

  markDone(id) {
    this.tasks = this.tasks.map((el) => {
      if (el.id == id) {
        return {
          ...el,
          isDone: !el.isDone,
        };
      }
      return el;
    });
    localStorage.setItem(TODO_KEY_LOCAL, JSON.stringify(this.tasks));
  }
  updateTaskTitle(id, newValue) {
    this.tasks = this.tasks.map((el) => {
      if (el.id == id) {
        return {
          ...el,
          title: newValue,
        };
      }
      return el;
    });
    localStorage.setItem(TODO_KEY_LOCAL, JSON.stringify(this.tasks));
  }

  updateTaskDesc(id, newValue) {
    this.tasks = this.tasks.map((el) => {
      if (el.id == id) {
        return {
          ...el,
          desc: newValue,
        };
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
const todosCountEl = document.getElementById("todosCount");
const addModelEl = document.getElementById("add-modal");
const addModelCloseBtn = document.getElementById("add-model-close-btn");
const addTaskFoatingBtn = document.getElementById("add-floating-btn");

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

addModelCloseBtn.addEventListener("click", function () {
  clearAddModalValue();
});
addTaskFoatingBtn.addEventListener("click", function () {
  addModelEl.style.display = "flex";
});

function clearAddModalValue() {
  inputTitle.value = "";
  inputDesc.value = "";
  addModelEl.style.display = "none";
}

addTaskBtn.addEventListener("click", function () {
  if (isEmpty(inputTitle.value)) {
    alert("Title must be present");
    return;
  }

  const task = {
    id: Date.now(),
    title: clearInput(inputTitle.value),
    desc: clearInput(inputDesc.value),
    isDone: false,
  };
  todoManger.addTask(task);
  renderTodos(todoManger.todosList);
  clearAddModalValue();
});

deleteAllTaskBtn.addEventListener("click", function () {
  todoManger.clearTask();
  renderTodos(todoManger.todosList);
});

function taskLIElementTemplate(currentTask) {
  return `<li class="todo-item" >
<div onclick="markDone(${currentTask.id})" class="iconEmpty ${
    currentTask.isDone ? "iconTick" : ""
  }">${currentTask.isDone ? "&#10003" : " "}</div>
<div class="item-content">
 <input value="${currentTask.title}" onblur="updateTaskTitle(${
    currentTask.id
  },this.value)" class="item-title-content ${
    currentTask.isDone ? "strikethrough" : ""
  }"></input>
 <textarea  spellcheck="false" onblur="updateTaskDesc(${
   currentTask.id
 },this.value)" class="item-desc-content ${
    currentTask.isDone ? "strikethrough" : ""
  }">${currentTask.desc}</textarea>
</div>
<div class="item-trailing">
<button onclick="deleteTodo(${currentTask.id})">\u00d7</button> 
<div>
</li>`;
}

function renderTodos(todos) {
  // todoslistEl.innerHTML = "";
  if (todos.length == 0) {
    todosCountEl.textContent = 0;
    todoslistEl.innerHTML = "<p>No items</p>";
    return;
  }
  let listcontent = "";
  todosCountEl.textContent = todos.length || 0;
  const isDoneList = todos.filter((e) => e.isDone === true);
  const isNotDoneList = todos.filter((e) => e.isDone === false);
  
  for (let i = 0; i < isNotDoneList.length; i++) {
    const currentTask = isNotDoneList[i];
    const taskLIElement = taskLIElementTemplate(currentTask);
    listcontent += taskLIElement;
  }
  for (let i = 0; i < isDoneList.length; i++) {
    const currentTask = isDoneList[i];
    const taskLIElement = taskLIElementTemplate(currentTask);
    listcontent += taskLIElement;
  }


  todoslistEl.innerHTML = listcontent;
}

function updateTaskTitle(id, newValue) {
  if (isEmpty(newValue)) return;
  todoManger.updateTaskTitle(id, clearInput(newValue));
  renderTodos(todoManger.todosList);
}

function updateTaskDesc(id, newValue) {
  if (isEmpty(newValue)) return;
  todoManger.updateTaskDesc(id, clearInput(newValue));
  renderTodos(todoManger.todosList);
}

function deleteTodo(id) {
  todoManger.deleteTask(id);
  renderTodos(todoManger.todosList);
}
function markDone(id) {
  todoManger.markDone(id);
  renderTodos(todoManger.todosList);
}

function clearInput(value) {
  return value.trim();
}

function isEmpty(value) {
  let val = clearInput(value);
  return val.length == 0;
}
