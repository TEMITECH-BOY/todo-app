const API_URL = "http://localhost:8000/api/";

const title = document.getElementById("title");
const description = document.getElementById("description");
const submitBtn = document.getElementById("submit");
const diplay = document.getElementById("display");

submitBtn.addEventListener("click", addTask);
window.addEventListener("DOMContentLoaded", getAllTasks);

async function getAllTasks() {
  try {
    const response = await fetch(`${API_URL}todos/`);
    const data = await response.json();
    renderTodo(data);
  } catch (error) {
    console.error(error);
  }
}

async function addTask(e) {
  e.preventDefault();
  try {
    const taskTitle = title.value;
    const taskDescription = description.value;

    const response = await fetch(`${API_URL}todos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskTitle, description: taskDescription }),
    });

    await response.json();

    title.value = "";
    description.value = "";
    getAllTasks();
  } catch (error) {
    console.error(error);
  }
}

function renderTodo(tasks) {
  diplay.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between bg-gray-50 p-3 rounded border";

    li.innerHTML = `
      <div class="flex items-center space-x-3">
        <input type="checkbox" ${
          task.completed ? "checked" : ""
        } onchange="toggleComplete(${task.id}, ${!task.completed})" />
        <span class="${task.completed ? "line-through text-gray-500" : ""}">
          <strong>${task.title}</strong>: ${task.description}
        </span>
      </div>
      <div class="space-x-2">
        <button onclick="editTask(${task.id}, \`${task.title}\`, \`${
      task.description
    }\`)" class="text-yellow-500 hover:text-yellow-600">✏️</button>
        <button onclick="deleteTask(${
          task.id
        })" class="text-red-500 hover:text-red-600">🗑</button>
      </div>
    `;
    diplay.appendChild(li);
  });
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}todos/${id}/`, { method: "DELETE" });
    getAllTasks();
  } catch (error) {
    console.error("Delete error:", error);
  }
}

function editTask(id, currentTitle, currentDesc) {
  const newTitle = prompt("Edit title:", currentTitle);
  const newDesc = prompt("Edit description:", currentDesc);
  if (newTitle !== null && newDesc !== null) {
    updateTask(id, newTitle, newDesc);
  }
}

async function updateTask(id, title, description) {
  try {
    await fetch(`${API_URL}todos/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    getAllTasks();
  } catch (error) {
    console.error("Update error:", error);
  }
}

async function toggleComplete(id, completed) {
  try {
    await fetch(`${API_URL}todos/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    getAllTasks();
  } catch (error) {
    console.error("Toggle error:", error);
  }
}
