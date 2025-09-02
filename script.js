document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addButton = document.getElementById('addButton');
  const taskList = document.getElementById('taskList');

  // Variável para rastrear a tarefa que está sendo editada
  let taskToEdit = null;

  loadTasks();

  addButton.addEventListener('click', () => {
    handleTaskAction();
  });

  taskInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      handleTaskAction();
    }
  });

  // FUNÇÃO ATUALIZADA: Agora lida tanto com a adição quanto com a edição
  function handleTaskAction() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
      if (taskToEdit) {
        // Modo de edição: atualiza a tarefa existente
        taskToEdit.firstChild.textContent = taskText;
        taskToEdit.classList.remove('editing');
        taskToEdit = null;
        addButton.textContent = 'Adicionar';
      } else {
        // Modo de adição: cria uma nova tarefa
        createTaskElement(taskText, false);
      }

      taskInput.value = '';
      saveTasks();
    }
  }

  // FUNÇÃO ATUALIZADA: Cria e configura o elemento da tarefa com o botão de edição
  function createTaskElement(taskText, isCompleted) {
    const listItem = document.createElement('li');

    // Use um span para o texto da tarefa para facilitar a edição
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    listItem.appendChild(taskSpan);

    if (isCompleted) {
      listItem.classList.add('completed');
    }

    listItem.addEventListener('click', () => {
      listItem.classList.toggle('completed');
      saveTasks();
    });

    // NOVO: Cria o botão de edição
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.className = 'edit-button';

    editButton.addEventListener('click', event => {
      event.stopPropagation();
      // Ativa o modo de edição
      taskToEdit = listItem;
      taskInput.value = taskSpan.textContent;
      addButton.textContent = 'Salvar';
      taskInput.focus();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';

    deleteButton.addEventListener('click', event => {
      event.stopPropagation();
      taskList.removeChild(listItem);
      saveTasks();
    });

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  }

  // FUNÇÕES DE SALVAR E CARREGAR (sem mudanças)
  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(item => {
      tasks.push({
        text: item.querySelector('span').textContent.trim(),
        completed: item.classList.contains('completed'),
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      JSON.parse(savedTasks).forEach(task => {
        createTaskElement(task.text, task.completed);
      });
    }
  }
});
