const cursorTracker = document.getElementById('cursor-tracker');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority');
const categorySelect = document.getElementById('category');
const timeInput = document.getElementById('time');
const locationInput = document.getElementById('location');
const todoList = document.getElementById('todo-list');
const sortPriorityBtn = document.getElementById('sort-priority');
const sortCategoryBtn = document.getElementById('sort-category');
const sortTimeBtn = document.getElementById('sort-time');
const notificationContainer = document.getElementById('notification-container');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function updateCursorTracker(e) {
    const x = e.clientX;
    const y = e.clientY;
    cursorTracker.style.left = `${x}px`;
    cursorTracker.style.top = `${y}px`;
}

document.addEventListener('mousemove', updateCursorTracker);

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-info">
                <span>${todo.text}</span>
                <span class="task-details">
                    ${todo.priority} | ${todo.category} | 
                    ${todo.time || 'No time'} | ${todo.location || 'No location'}
                </span>
            </div>
            <div class="task-actions">
                <button onclick="toggleTodo(${index})" class="${todo.completed ? '' : 'complete'}">${todo.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteTodo(${index})">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

function addTodo(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        const todo = {
            text,
            priority: prioritySelect.value,
            category: categorySelect.value,
            time: timeInput.value,
            location: locationInput.value,
            completed: false
        };
        todos.push(todo);
        saveTodos();
        renderTodos();
        todoForm.reset();
        showNotification('Task added successfully!');
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
    showNotification(`Task ${todos[index].completed ? 'completed'
 : 'uncompleted'}!`);
}

function deleteTodo(index) {
    const deletedTodo = todos.splice(index, 1)[0];
    saveTodos();
    renderTodos();
    showNotification(`Task "${deletedTodo.text}" deleted!`);
}

function sortTodos(criteria) {
    todos.sort((a, b) => {
        if (criteria === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        } else if (criteria === 'category') {
            return a.category.localeCompare(b.category);
        } else if (criteria === 'time') {
            return a.time.localeCompare(b.time);
        }
    });
    saveTodos();
    renderTodos();
    showNotification(`Tasks sorted by ${criteria}!`);
}

todoForm.addEventListener('submit', addTodo);
sortPriorityBtn.addEventListener('click', () => sortTodos('priority'));
sortCategoryBtn.addEventListener('click', () => sortTodos('category'));
sortTimeBtn.addEventListener('click', () => sortTodos('time'));

renderTodos();