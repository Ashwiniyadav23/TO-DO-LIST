// Express framework ko import karo
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware - JSON data ko samajhne ke liye
app.use(express.json());
// Public folder ko serve karne ke liye
app.use(express.static('public'));

// Todos ko store karne ke liye array
let todos = [];
let nextId = 1;

// 1. SAARE TODOS GET KARO
app.get('/api/todos', (req, res) => {
    res.json(todos);  // Sare todos bhej do
});

// 2. NAYA TODO ADD KARO
app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    
    // Naya todo banao
    const newTodo = {
        id: nextId++,
        text: text,
        completed: false
    };
    
    todos.push(newTodo);  // Array mein add karo
    res.json(newTodo);     // Response bhejo
});

// 3. TODO KO COMPLETE/INCOMPLETE KARO
app.put('/api/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    todo.completed = !todo.completed;  // Opposite kar do
    res.json(todo);
});

// 4. TODO KO EDIT KARO
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { text } = req.body;
    const todo = todos.find(t => t.id === id);
    
    todo.text = text;  // Text update kar do
    res.json(todo);
});

// 5. TODO DELETE KARO
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(t => t.id !== id);  // Us todo ko hata do
    res.json({ message: 'Deleted!' });
});

// Server start karo
app.listen(PORT, () => {
    console.log(`✅ Server chal raha hai: http://localhost:${PORT}`);
});
