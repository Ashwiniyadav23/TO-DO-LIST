document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput'); 
    const addTaskButton = document.getElementById('btn'); 
    const taskList = document.getElementById('taskList'); 
    const resetBtn = document.getElementById('resetBtn'); 
    const prioritySelect = document.getElementById('prioritySelect'); 
    const dueDateInput = document.getElementById('dueDateInput'); 
    const taskCount = document.getElementById('taskCount'); 

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task.text, task.completed, task.date, task.priority, task.dueDate));

    addTaskButton.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        const taskPriority = prioritySelect.value; 
        const taskDueDate = dueDateInput.value; 

        if (taskText !== '') {
            addTaskToList(taskText, false, '', taskPriority, taskDueDate);
            saveTaskToLocalStorage(taskText, false, '', taskPriority, taskDueDate);
            taskInput.value = '';
            dueDateInput.value = ''; 
            updateTaskCount(); 
        } 
    });

    function addTaskToList(taskText, completed, date, priority, dueDate) {
        const li = document.createElement('li');
        li.classList.add('task-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', function() {
            span.classList.toggle('completed');
            updateTaskCompletionInLocalStorage(taskText, checkbox.checked);
            updateTaskCount(); 
        });

        const span = document.createElement('span');
        span.textContent = taskText;
        span.className = 'task-text';
        if (completed) span.classList.add('completed');

        const dateSpan = document.createElement('span'); 
        dateSpan.textContent = date ? ` (Added on: ${date})` : ''; 
        dateSpan.className = 'task-date'; 

        const prioritySpan = document.createElement('span'); 
        prioritySpan.textContent = ` [Priority: ${priority}]`;
        prioritySpan.className = 'task-priority';

        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = ` (Due: ${dueDate})`;
        dueDateSpan.className = 'task-due-date';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', function() {
            editTask(li, span, taskText, priority, dueDate);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', function() {
            li.remove();
            removeTaskFromLocalStorage(taskText);
            updateTaskCount(); 
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(dateSpan); 
        li.appendChild(prioritySpan);
        li.appendChild(dueDateSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    function editTask(li, span, oldText, oldPriority, oldDueDate) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        li.insertBefore(input, span);
        li.removeChild(span);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'save-button';
        saveButton.addEventListener('click', function() {
            const newText = input.value.trim();
            const newPriority = prioritySelect.value; 
            const newDueDate = dueDateInput.value; 

            if (newText !== '') {
                span.textContent = newText;
                li.insertBefore(span, input);
                li.removeChild(input);
                li.removeChild(saveButton);
                li.appendChild(editButton);

                updateTaskTextInLocalStorage(oldText, newText, oldPriority, newPriority, oldDueDate, newDueDate);
            }
        });

        li.appendChild(saveButton);
        li.removeChild(editButton);
    }

    function saveTaskToLocalStorage(taskText, completed, date, priority, dueDate) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: taskText, completed: completed, date: date, priority: priority, dueDate: dueDate });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskCompletionInLocalStorage(taskText, completed) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.text === taskText) {
                task.completed = completed;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskTextInLocalStorage(oldText, newText, oldPriority, newPriority, oldDueDate, newDueDate) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.text === oldText) {
                task.text = newText;
                task.priority = newPriority;
                task.dueDate = newDueDate;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    }

    function updateTaskCount() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const completedCount = tasks.filter(task => task.completed).length;
        const totalCount = tasks.length;
        taskCount.textContent = `Tasks: ${totalCount} | Completed: ${completedCount}`;
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            taskList.innerHTML = '';
            localStorage.removeItem('tasks');
            updateTaskCount(); 
        });
    }

    updateTaskCount();
});