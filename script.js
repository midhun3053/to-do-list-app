// Update Date & Time every second
function updateDateTime() {
  const now = new Date();
  const formatted = now.toLocaleString();
  document.getElementById("datetime").textContent = formatted;
}
setInterval(updateDateTime, 1000);

// Update Task Count Display
function updateTaskCount() {
  const total = document.querySelectorAll("#taskList li").length;
  const completed = document.querySelectorAll("#taskList li.completed").length;
  const pending = total - completed;
  document.getElementById("taskCount").textContent =
    `Total: ${total}, Completed: ${completed}, Pending: ${pending}`;
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(task => {
    createTask(task.text, task.completed);
  });
  updateTaskCount();
}

// Create Task Element
function createTask(taskText, isCompleted = false) {
  const li = document.createElement("li");
  if (isCompleted) li.classList.add("completed");

  const checkCircle = document.createElement("span");
  checkCircle.classList.add("circle");
  if (isCompleted) checkCircle.classList.add("checked");

  checkCircle.onclick = () => {
    li.classList.toggle("completed");
    checkCircle.classList.toggle("checked");
    updateTaskCount();
    saveTasks();
  };

  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = () => {
    li.remove();
    updateTaskCount();
    saveTasks();
  };

  li.appendChild(checkCircle);
  li.appendChild(taskSpan);
  li.appendChild(deleteBtn);

  document.getElementById("taskList").appendChild(li);
}

// Add New Task
function addTask() {
  const input = document.getElementById("taskInput");
  const timeInput = document.getElementById("reminderTime");
  const taskText = input.value.trim();
  const reminderTime = timeInput.value;

  if (taskText === "") return;

  createTask(taskText);
  input.value = "";
  timeInput.value = "";
  updateTaskCount();
  saveTasks();

  if (reminderTime) {
    const now = new Date();
    const [h, m] = reminderTime.split(":").map(Number);
    const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    const delay = reminderDate.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        alert(`⏰ Reminder: "${taskText}"`);
      }, delay);
    }
  }
}

// Delete All Tasks
function deleteAllTasks() {
  document.getElementById("taskList").innerHTML = "";
  updateTaskCount();
  saveTasks();
}

// Load tasks on startup
window.onload = () => {
  loadTasks();
};

// Toggle Dark Mode
const toggleBtn = document.getElementById("toggleModeBtn");

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark-mode");
    toggleBtn.textContent = "☀️ Light Mode";
  } else {
    document.documentElement.classList.remove("dark-mode");
    toggleBtn.textContent = "🌙 Dark Mode";
  }
}

toggleBtn.onclick = () => {
  const isDark = document.documentElement.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  toggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
};

// Load Theme from LocalStorage
window.onload = () => {
  loadTasks();
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
};
