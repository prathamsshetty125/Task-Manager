
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCounter = document.getElementById("task-counter");
const emptyMessage = document.getElementById("empty-message");
const errorMessage = document.getElementById("error-message");
const filterButtons = document.querySelectorAll(".filter");


let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
let currentFilter = "all";


function saveTasks() {
  localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}


function updateCounter() {
  const pending = tasks.filter(task => !task.completed).length;
  taskCounter.textContent =
    `${pending} task${pending !== 1 ? "s" : ""} pending`;
}


function renderTasks() {
  taskList.replaceChildren();

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

   
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

   
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, span, deleteButton);
    taskList.appendChild(li);
  });

  emptyMessage.hidden = filteredTasks.length !== 0;
  updateCounter();
}


taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();

 
  if (!text) {
    errorMessage.textContent = "Please enter a task first!";
    taskInput.focus();
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    text: text,
    completed: false
  });

  saveTasks();
  currentFilter = "all";

  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  taskInput.value = "";
  errorMessage.textContent = "";
  renderTasks();
  taskInput.focus();
});


taskInput.addEventListener("input", () => {
  errorMessage.textContent = "";
});


filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderTasks();
  });
});


renderTasks();
