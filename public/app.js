// ==========================================
// SIMPLE TO-DO LIST - BILKUL EASY CODE!
// Koi React ya library nahi - Sirf JavaScript!
// ==========================================

// Jab page load ho
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();  // Todos load karo
});

// Data yaha store hoga
let todos = [];


// ==========================================
// 1. SARE TODOS LOAD KARO (Server se)
// ==========================================
async function loadTodos() {
    const response = await fetch('/api/todos');
    todos = await response.json();
    renderApp();  // Screen par dikha do
}


// ==========================================
// 2. PURA APP RENDER KARO
// ==========================================
function renderApp() {
    const root = document.getElementById('root');
    
    // Container banao
    root.innerHTML = `
        <div class="container">
            <!-- Header -->
            <h1>📝 Meri Simple To-Do List</h1>

            <!-- Input Section -->
            <div class="input-section">
                <input 
                    type="text" 
                    id="todoInput" 
                    placeholder="Apna task likho..."
                >
                <button id="addBtn">Add Karo</button>
            </div>

            <!-- Todo List -->
            <ul id="todoList">
                ${renderTodos()}
            </ul>
        </div>
    `;

    // Event listeners lagao
    attachEventListeners();
}


// ==========================================
// 3. TODOS KO HTML MEIN CONVERT KARO
// ==========================================
function renderTodos() {
    // Agar koi todo nahi
    if (todos.length === 0) {
        return '<li class="empty-message">Abhi koi task nahi hai! Upar se add karo 🎯</li>';
    }

    // Har todo ko HTML mein badlo
    return todos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <!-- Checkbox aur Text -->
            <div class="todo-content" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="todo-text">${todo.text}</span>
            </div>

            <!-- Buttons -->
            <div class="todo-buttons">
                <button class="edit-btn" data-id="${todo.id}" data-text="${todo.text}">
                    Edit
                </button>
                <button class="delete-btn" data-id="${todo.id}">
                    Delete
                </button>
            </div>
        </li>
    `).join('');
}


// ==========================================
// 4. EVENT LISTENERS LAGAO
// ==========================================
function attachEventListeners() {
    // Add button
    document.getElementById('addBtn').onclick = addTodo;

    // Enter key
    document.getElementById('todoInput').onkeypress = (e) => {
        if (e.key === 'Enter') addTodo();
    };

    // Checkboxes aur todo content
    document.querySelectorAll('.todo-checkbox, .todo-content').forEach(el => {
        el.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            if (id) toggleTodo(id);
        };
    });

    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            const text = e.target.dataset.text;
            editTodo(id, text);
        };
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            deleteTodo(id);
        };
    });
}


// ==========================================
// 5. NAYA TODO ADD KARO
// ==========================================
async function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (!text) {
        alert('Pehle kuch likho!');
        return;
    }

    // Server ko bhejo
    await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
    });

    input.value = '';  // Input khali karo
    loadTodos();        // Todos reload karo
}


// ==========================================
// 6. TODO COMPLETE/INCOMPLETE KARO
// ==========================================
async function toggleTodo(id) {
    await fetch(`/api/todos/${id}/toggle`, {
        method: 'PUT'
    });
    loadTodos();
}


// ==========================================
// 7. TODO EDIT KARO
// ==========================================
async function editTodo(id, oldText) {
    const newText = prompt('Naya task likho:', oldText);

    if (!newText || !newText.trim()) {
        return;
    }

    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
    });

    loadTodos();
}


// ==========================================
// 8. TODO DELETE KARO
// ==========================================
async function deleteTodo(id) {
    if (!confirm('Delete karna hai?')) {
        return;
    }

    await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
    });

    loadTodos();
}
