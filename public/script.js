// ==========================================
// SIMPLE TO-DO LIST - EASY CODE
// ==========================================

// Backend ka address
const API_URL = '/api/todos';

// Jab page load ho, sare todos dikha do
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();  // Todos load karo
});


// ==========================================
// 1. SARE TODOS LOAD KARO (GET)
// ==========================================
async function loadTodos() {
    // Server se todos manga lo
    const response = await fetch(API_URL);
    const todos = await response.json();
    
    // Screen par dikha do
    displayTodos(todos);
}


// ==========================================
// 2. TODOS KO SCREEN PAR DIKHAO
// ==========================================
function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
    
    // Agar koi todo nahi hai
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-message">Abhi koi task nahi hai! Upar se add karo 🎯</li>';
        return;
    }
    
    // Sabhi todos dikhao
    todoList.innerHTML = '';  // Pehle khali kar do
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="todo-content" onclick="toggleTodo(${todo.id})">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onclick="event.stopPropagation(); toggleTodo(${todo.id})"
                >
                <span class="todo-text">${todo.text}</span>
            </div>
            <div class="todo-buttons">
                <button class="edit-btn" onclick="editTodo(${todo.id}, '${todo.text.replace(/'/g, "\\'")}')">Edit</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
}


// ==========================================
// 3. NAYA TODO ADD KARO (POST)
// ==========================================
async function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();  // Extra spaces hata do
    
    // Agar kuch nahi likha
    if (!text) {
        alert('Pehle kuch likho!');
        return;
    }
    
    // Server ko bhejo
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
    });
    
    input.value = '';  // Input box khali kar do
    loadTodos();       // Todos reload kar do
}


// ==========================================
// 4. TODO KO COMPLETE/INCOMPLETE KARO (PUT)
// ==========================================
async function toggleTodo(id) {
    // Server ko batao
    await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PUT'
    });
    
    loadTodos();  // Todos reload kar do
}


// ==========================================
// 5. TODO EDIT KARO (PUT)
// ==========================================
async function editTodo(id, oldText) {
    // User se naya text pucho
    const newText = prompt('Naya task likho:', oldText);
    
    // Agar cancel kiya ya khali chhoda
    if (!newText || newText.trim() === '') {
        return;
    }
    
    // Server ko bhejo
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
    });
    
    loadTodos();  // Todos reload kar do
}


// ==========================================
// 6. TODO DELETE KARO (DELETE)
// ==========================================
async function deleteTodo(id) {
    // Confirm karo
    if (!confirm('Kya aap sure ho delete karna hai?')) {
        return;
    }
    
    // Server ko batao
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    
    loadTodos();  // Todos reload kar do
}


// ==========================================
// 7. ENTER KEY PRESS PAR ADD KARO
// ==========================================
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
}
