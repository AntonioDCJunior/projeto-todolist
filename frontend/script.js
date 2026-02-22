const apiUrl = "http://localhost:5000/tasks";
let currentFilter = "all";

async function fetchTasks() {
  try {
    let url = apiUrl;
    if (currentFilter === "pending") {
      url += "?status=pending";
    } else if (currentFilter === "done") {
      url += "?status=done";
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao buscar tarefas");
    }
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (err) {
    console.error(err);
    alert("Não foi possível carregar as tarefas.");
  }
}

function displayTasks(tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  if (!tasks.length) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma tarefa.";
    li.classList.add("empty");
    taskList.appendChild(li);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    buttonGroup.appendChild(createCompleteButton(task));
    buttonGroup.appendChild(createUpdateButton(task));
    buttonGroup.appendChild(createDeleteButton(task));

    li.appendChild(titleSpan);
    li.appendChild(buttonGroup);
    taskList.appendChild(li);
  });
}

async function createTask() {
  const input = document.getElementById("itemInput");
  const taskName = input.value.trim();

  if (!taskName) {
    alert("Por favor, insira um nome para a tarefa.");
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskName }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Erro ao criar tarefa");
    }

    input.value = "";
    fetchTasks();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

function createCompleteButton(task) {
  const button = document.createElement("button");
  button.className = "complete";
  button.textContent = task.completed ? "Reabrir" : "Concluir";

  button.onclick = async () => {
    try {
      const response = await fetch(`${apiUrl}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar tarefa");
      }

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Erro ao marcar tarefa.");
    }
  };

  return button;
}

function createUpdateButton(task) {
  const button = document.createElement("button");
  button.className = "update";
  button.textContent = "Atualizar";

  button.onclick = async () => {
    const newName = prompt("Novo nome da tarefa:", task.title);
    if (!newName) return;

    try {
      const response = await fetch(`${apiUrl}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newName }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar tarefa");
      }

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar tarefa.");
    }
  };

  return button;
}

function createDeleteButton(task) {
  const button = document.createElement("button");
  button.className = "delete";
  button.textContent = "Deletar";

  button.onclick = async () => {
    if (!confirm("Deseja realmente deletar esta tarefa?")) return;

    try {
      const response = await fetch(`${apiUrl}/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar tarefa");
      }

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar tarefa.");
    }
  };

  return button;
}

function changeFilter(filter) {
  currentFilter = filter;

  const buttons = document.querySelectorAll(".filter");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  fetchTasks();
}

async function shareTasks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Erro ao buscar tarefas para compartilhar.");
    }

    const tasks = await response.json();

    if (!tasks.length) {
      alert("Não há tarefas para compartilhar.");
      return;
    }

    const text =
      "Minha lista de tarefas:\n\n" +
      tasks
        .map(
          (t) =>
            `- ${t.title} ${t.completed ? "(concluída ✅)" : "(pendente ⏳)"}`
        )
        .join("\n");

    if (navigator.share) {
      await navigator.share({
        title: "Minha To-Do List",
        text,
      });
    } else {
      prompt("Copie e compartilhe sua lista de tarefas:", text);
    }
  } catch (err) {
    console.error(err);
    alert("Não foi possível compartilhar a lista.");
  }
}

window.onload = fetchTasks;
