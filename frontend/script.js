const apiUrl = 'http://localhost:5000/tasks';

async function fetchTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Limpa a lista antes de adicionar novas tarefas
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.title + (task.completed ? " (Concluída)" : "");

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        buttonGroup.appendChild(createCompleteButton(index));
        buttonGroup.appendChild(createUpdateButton(index));
        buttonGroup.appendChild(createDeleteButton(index));

        li.appendChild(buttonGroup);
        taskList.appendChild(li);
    });
}

async function createTask() {
    const taskName = document.getElementById('itemInput').value;
    if (taskName) {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: taskName })
        });
        document.getElementById('itemInput').value = ''; // Limpar o campo de entrada
        fetchTasks(); // Atualizar a lista de tarefas
    } else {
        alert("Por favor, insira um nome para a tarefa.");
    }
}

function createCompleteButton(index) {
    const button = document.createElement('button');
    button.className = 'complete';
    button.innerHTML = '<i class="fas fa-check"></i> Concluir';
    button.onclick = async () => {
        await fetch(`${apiUrl}/${index}/complete`, { method: 'PUT' });
        fetchTasks();
    };
    return button;
}

function createUpdateButton(index) {
    const button = document.createElement('button');
    button.className = 'update';
    button.innerHTML = '<i class="fas fa-edit"></i> Atualizar';
    button.onclick = async () => {
        const newName = prompt("Novo nome da tarefa:");
        if (newName) {
            await fetch(`${apiUrl}/${index}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newName })
            });
            fetchTasks();
        }
    };
    return button;
}

function createDeleteButton(index) {
    const button = document.createElement('button');
    button.className = 'delete';
    button.innerHTML = '<i class="fas fa-trash"></i> Deletar';
    button.onclick = async () => {
        await fetch(`${apiUrl}/${index}`, { method: 'DELETE' });
        fetchTasks (); // Atualizar a lista de tarefas após a exclusão
    };
    return button;
}

// Chamar a função fetchTasks ao carregar a página
window.onload = fetchTasks;