const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todoListElement = document.getElementById("todos-list");
const notificationElement = document.querySelector(".notification");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let EditTodoId = -1;

// 1st render
renderTodos();

// Form Submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  saveTodo();

  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
});

// Save Todo
function saveTodo() {
  const todoValue = todoInput.value;

  //Check if empty
  const isEmpty = todoValue.trim() === "";

  //Check if duplicate
  const isDuplicate = todos.some((todo) => {
    return todo.value.trim().toLowerCase() === todoValue.trim().toLowerCase();
  });

  if (isEmpty) {
    showFailNotification("Todo's input is empty");
    return;
  } else if (isDuplicate) {
    showFailNotification("ToDo already exists!");
    return;
  }
  if (EditTodoId >= 0 && !isEmpty) {
    //update the edit  todo
    todos = todos.map((todo, index) => ({
      ...todo,
      value: index === EditTodoId ? todoValue : todo.value,
    }));
    showSuccessNotification("Todo succesfully edited!");

    EditTodoId = -1;
    todoInput.value = "";
  } else {
    todos.push({
      value: todoValue,
      checked: false,
      createdAt: displayDateAndTime(),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16), // generates random color
    });
    showSuccessNotification("Todo succesfully added!!");

    todoInput.value = "";
  }
}

// Render Todo
function renderTodos() {
  if (todos.length === 0) {
    todoListElement.innerHTML = "<center> Nothing To Do!!</center>";
    return;
  }
  todoListElement.innerHTML = "";

  // RENDER TODOS
  todos.forEach((todo, index) => {
    todoListElement.innerHTML += `
  <div class="todo" id=${index}>
    <i 
      class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
      style="color : ${todo.color}"
      data-action="check"
    ></i>
    <p class="${todo.checked ? "checked" : ""}" data-action="check">${
      todo.value
    }</p>
    <p id="dateAndTime">${todo.createdAt}</p>
    <i class="bi bi-pencil-square" data-action="edit"></i>
    <i class="bi bi-trash" data-action="delete"></i>

  </div>

  `;
  });
}

//Click Event Listener For All The Todos
todoListElement.addEventListener("click", (e) => {
  const target = e.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  //todo id
  const todo = parentElement;
  const todoId = Number(todo.id);

  //target action
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);
});

// check a todo
function checkTodo(todoId) {
  // add success notification
  // todos = todos.map((todo, index) => {
  //   return {
  //     ...todo,
  //     checked: index === todoId ? !todo.checked : todo.checked,
  //   };
  // });

  todos[todoId].checked = !todos[todoId].checked;
  todos[todoId].checked ? showSuccessNotification("Todo DONEEE :)") : null;

  renderTodos();
  // showSuccessNotification("Todo completed :)");
  localStorage.setItem("todos", JSON.stringify(todos));
}

// edit a todo
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

//  delete todo
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);

  EditTodoId = -1;

  //re-render
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
  showSuccessNotification("Todo succesfully deleted!");
}

//  show a notification
function showSuccessNotification(msg) {
  notificationElement.innerHTML = msg;

  notificationElement.classList.add("notif-enter-success");

  setTimeout(() => {
    notificationElement.classList.remove("notif-enter-success");
    notificationElement.innerHTML = "";
  }, 2000);
}

function showFailNotification(msg) {
  notificationElement.innerHTML = msg;

  notificationElement.classList.add("notif-enter-fail");

  setTimeout(() => {
    notificationElement.classList.remove("notif-enter-fail");
    notificationElement.innerHTML = "";
  }, 2000);
}

function displayDateAndTime() {
  const date = new Date();
  const n = date.toDateString();
  const time = date.toLocaleTimeString();

  return n + time;
}
