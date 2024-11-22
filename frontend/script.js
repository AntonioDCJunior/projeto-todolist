const API_URL = 'http://localhost:5000/tasks';

async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = task.name;
        listItem.appendChild(createDeleteButton(index));
        taskList.appendChild(listItem);
    });
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const newTask = { name: taskInput.value };
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });
    taskInput.value = '';
    fetchTasks();
}

function createDeleteButton(taskId) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.onclick = async () => {
        await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
        fetchTasks();
    };
    return button;
}

document.addEventListener('DOMContentLoaded', fetchTasks);
