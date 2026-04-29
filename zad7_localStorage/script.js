const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const storageKey = "zad7_todo_list";

let todos = loadTodos();

function createTodoId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadTodos() {
  const savedTodos = localStorage.getItem(storageKey);

  if (!savedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);

    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos
      .filter((todo) => todo && typeof todo.text === "string")
      .map((todo) => ({
        id: typeof todo.id === "string" && todo.id ? todo.id : createTodoId(),
        text: todo.text.trim(),
      }))
      .filter((todo) => todo.text.length > 0);
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

function renderTodos() {
  if (!todoList) {
    return;
  }

  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const listItem = document.createElement("li");
    const text = document.createElement("span");
    const deleteButton = document.createElement("button");

    listItem.className = "todo-item";
    text.textContent = todo.text;
    deleteButton.type = "button";
    deleteButton.textContent = "Usuń";

    deleteButton.addEventListener("click", () => {
      todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    listItem.append(text, deleteButton);
    todoList.appendChild(listItem);
  });
}

function addTodo(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return;
  }

  todos = [...todos, { id: createTodoId(), text: trimmedText }];
  saveTodos();
  renderTodos();
}

if (todoForm && todoInput) {
  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo(todoInput.value);
    todoForm.reset();
    todoInput.focus();
  });
}

renderTodos();