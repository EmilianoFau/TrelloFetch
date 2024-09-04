document.addEventListener('DOMContentLoaded', () => {
    const newTaskButton = document.getElementById('new-task-button');
    const newTaskButtonMobile = document.getElementById('new-task-button-mobile');
    const taskModal = document.getElementById('task-modal');
    const cancelButton = document.getElementById('cancel-button');
    const taskForm = document.getElementById('task-form');
    const editTaskModal = document.getElementById('edit-task-modal');
    const editCancelButton = document.getElementById('edit-cancel-button');
    const editTaskForm = document.getElementById('edit-task-form');
    const columns = document.querySelectorAll('.column');

    const taskTitle = document.getElementById('task-title');
    const taskDescription = document.getElementById('task-description');
    const taskAssigned = document.getElementById('task-assigned');
    const taskPriority = document.getElementById('task-priority');
    const taskStatus = document.getElementById('task-status');
    const taskDeadline = document.getElementById('task-deadline');

    const editTaskTitle = document.getElementById('edit-task-title');
    const editTaskDescription = document.getElementById('edit-task-description');
    const editTaskAssigned = document.getElementById('edit-task-assigned');
    const editTaskPriority = document.getElementById('edit-task-priority');
    const editTaskStatus = document.getElementById('edit-task-status');
    const editTaskDeadline = document.getElementById('edit-task-deadline');
    const eliminarTask = document.getElementById('eliminar-tarea');
    const eliminarConfirmarModal = document.getElementById('confirmar-eliminar');
    const siEliminar = document.getElementById('si-eliminar');
    const noEliminar = document.getElementById('no-eliminar');

    //loadTasks();
    getData();
    let currentTaskDiv = null;

    newTaskButton.addEventListener('click', () => {
        clearForm();
        taskModal.classList.add('is-active');
    });

    newTaskButtonMobile.addEventListener('click', () => {
        clearForm();
        taskModal.classList.add('is-active');
    });

    cancelButton.addEventListener('click', closeModal);
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    editCancelButton.addEventListener('click', closeEditModal);
    document.getElementById('edit-modal-close').addEventListener('click', closeEditModal);

    function closeModal() {
        taskModal.classList.remove('is-active');
    }

    function closeEditModal() {
        editTaskModal.classList.remove('is-active');
    }

    function closeConfirmModal() {
        eliminarConfirmarModal.classList.remove('is-active');
    }

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskDiv = document.createElement('div');
        taskDiv.className = 'box';
        taskDiv.setAttribute('data-title', taskTitle.value);
        taskDiv.setAttribute('data-description', taskDescription.value);
        taskDiv.setAttribute('data-assigned', taskAssigned.value);
        taskDiv.setAttribute('data-priority', taskPriority.value);
        taskDiv.setAttribute('data-status', taskStatus.value);
        taskDiv.setAttribute('data-deadline', taskDeadline.value);
        taskDiv.setAttribute('draggable', 'true');
        taskDiv.innerHTML = `<strong>${taskTitle.value}</strong><p>${taskDescription.value}</p>`;

        const column = document.getElementById(taskStatus.value);
        column.querySelector('.task-list-content').appendChild(taskDiv);

        taskDiv.addEventListener('dragstart', () => {
            taskDiv.classList.add('is-dragging');
        });

        taskDiv.addEventListener('dragend', () => {
            taskDiv.classList.remove('is-dragging');
            saveTasks();
        });

        taskDiv.addEventListener('click', () => openEditModal(taskDiv));

        saveTasks();
        closeModal();
    });

    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const taskList = column.querySelector('.task-list-content');
            const draggingTask = document.querySelector('.is-dragging');
            if (afterElement == null) {
                taskList.appendChild(draggingTask);
            } else {
                taskList.insertBefore(draggingTask, afterElement);
            }
        });

        column.addEventListener('drop', (e) => {
            const draggingTask = document.querySelector('.is-dragging');
            if (draggingTask) {
                const newStatus = column.id;
                draggingTask.setAttribute('data-status', newStatus);
                saveTasks(); 
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.box:not(.is-dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function openEditModal(taskDiv) {
        currentTaskDiv = taskDiv;
        editTaskTitle.value = taskDiv.getAttribute('data-title');
        editTaskDescription.value = taskDiv.getAttribute('data-description');
        editTaskAssigned.value = taskDiv.getAttribute('data-assigned');
        editTaskPriority.value = taskDiv.getAttribute('data-priority');
        editTaskStatus.value = taskDiv.getAttribute('data-status');
        editTaskDeadline.value = taskDiv.getAttribute('data-deadline');
        editTaskModal.classList.add('is-active');
    }

    editTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        currentTaskDiv.setAttribute('data-title', editTaskTitle.value);
        currentTaskDiv.setAttribute('data-description', editTaskDescription.value);
        currentTaskDiv.setAttribute('data-assigned', editTaskAssigned.value);
        currentTaskDiv.setAttribute('data-priority', editTaskPriority.value);
        currentTaskDiv.setAttribute('data-status', editTaskStatus.value);
        currentTaskDiv.setAttribute('data-deadline', editTaskDeadline.value);
        currentTaskDiv.innerHTML = `<strong>${editTaskTitle.value}</strong><p>${editTaskDescription.value}</p>`;

        const column = document.getElementById(editTaskStatus.value);
        if (column) {
            column.querySelector('.task-list-content').appendChild(currentTaskDiv);
        }

        saveTasks();
        closeEditModal();
    });

    eliminarTask.addEventListener('click', () => {
        eliminarConfirmarModal.classList.add('is-active');
        closeEditModal();
    })

    siEliminar.addEventListener('click', () => {
        currentTaskDiv.remove();
        closeConfirmModal();
    })

    noEliminar.addEventListener('click', () => {
        closeConfirmModal();
    })

    function clearForm() {
        taskTitle.value = '';
        taskDescription.value = '';
        taskAssigned.selectedIndex = 0;
        taskPriority.selectedIndex = 0;
        taskStatus.selectedIndex = 0;
        taskDeadline.value = '';
    }

    function saveTasks() {
        const tasks = [];
        columns.forEach(column => {
            const taskDivs = column.querySelectorAll('.box');
            taskDivs.forEach(taskDiv => {
                tasks.push({
                    title: taskDiv.getAttribute('data-title'),
                    description: taskDiv.getAttribute('data-description'),
                    assigned: taskDiv.getAttribute('data-assigned'),
                    priority: taskDiv.getAttribute('data-priority'),
                    status: taskDiv.getAttribute('data-status'),
                    deadline: taskDiv.getAttribute('data-deadline'),
                    columnId: column.id 
                });
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'box';
            taskDiv.setAttribute('data-title', task.title);
            taskDiv.setAttribute('data-description', task.description);
            taskDiv.setAttribute('data-assigned', task.assigned);
            taskDiv.setAttribute('data-priority', task.priority);
            taskDiv.setAttribute('data-status', task.status);
            taskDiv.setAttribute('data-deadline', task.deadline);
            taskDiv.setAttribute('draggable', 'true');
            taskDiv.innerHTML = `<strong>${task.title}</strong><p>${task.description}</p>`;

            const column = document.getElementById(task.status);
            if (column) {
                column.querySelector('.task-list-content').appendChild(taskDiv);

                taskDiv.addEventListener('dragstart', () => {
                    taskDiv.classList.add('is-dragging');
                });

                taskDiv.addEventListener('dragend', () => {
                    taskDiv.classList.remove('is-dragging');
                    saveTasks();
                });

                taskDiv.addEventListener('click', () => openEditModal(taskDiv));
            }
        });
    }

    async function getData() {
        try {
            const response = await fetch("http://localhost:3000/api/tasks");
            if (!response.ok) {
                throw new Error("Error " + response.statusText);
            }
            const data = await response.json();
            console.log(data);
            data.forEach(task => {
                loadServerData(task);
            })
        } catch (error) {
            console.error("Error con el fetch:", error);
        }
    }

    function convertDateFormat(dateString) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    }

    function loadServerData(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'box';
        taskDiv.setAttribute('data-title', task.title);
        taskDiv.setAttribute('data-description', task.description);
        taskDiv.setAttribute('data-assigned', task.assignedTo);
        taskDiv.setAttribute('data-priority', task.priority);
        taskDiv.setAttribute('data-status', task.status.toLowerCase().replace(' ', '-'));
        date = convertDateFormat(task.endDate);
        taskDiv.setAttribute('data-deadline', date);
        taskDiv.setAttribute('draggable', 'true');
        taskDiv.innerHTML = `<strong>${task.title}</strong><p>${task.description}</p>`;

        let columnId = task.status.toLowerCase().replace(/ /g, '-');

        const column = document.getElementById(columnId);
        if (column) {
            column.querySelector('.task-list-content').appendChild(taskDiv);

            taskDiv.addEventListener('dragstart', () => {
                taskDiv.classList.add('is-dragging');
            });

            taskDiv.addEventListener('dragend', () => {
                taskDiv.classList.remove('is-dragging');
                saveTasks();
            });

            taskDiv.addEventListener('click', () => openEditModal(taskDiv));
        }
    }
});
