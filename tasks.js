// 🔐 Authentication Check
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// 📋 Render Tasks
function renderTasks() {
    const tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
    const tasksList = document.getElementById('tasksList');

    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                No tasks yet. <a href="add-task.html">Add your first task!</a>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            
            <div class="task-info">
                <h4>${task.name}</h4>
                <div class="task-meta">
                    <span style="color:${getPriorityColor(task.priority)}">
                        ${task.priority?.toUpperCase()}
                    </span> 
                    • Due: ${new Date(task.dueDate).toLocaleString()}
                    ${task.description ? `• ${task.description.substring(0, 50)}...` : ''}
                </div>
            </div>

            <div class="task-actions">
                <button class="btn btn-success" onclick="toggleComplete(${task.id})">
                    ${task.completed ? '↻ Undo' : '✅ Complete'}
                </button>

                <button class="btn btn-danger" onclick="deleteTask(${task.id})">
                    🗑️
                </button>
            </div>

        </div>
    `).join('');
}

// 🎨 Priority Color
function getPriorityColor(priority) {
    const colors = {
        high: '#ff6b6b',
        medium: '#ffd43b',
        low: '#51cf66'
    };
    return colors[priority] || '#aaa';
}

// ✅ Toggle Complete
function toggleComplete(id) {
    let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];

    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    localStorage.setItem('studyTasks', JSON.stringify(tasks));
    renderTasks();
}

// 🗑️ Delete Task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
        tasks = tasks.filter(task => task.id !== id);

        localStorage.setItem('studyTasks', JSON.stringify(tasks));
        renderTasks();
    }
}

// 👤 Optional User Info
function showUserInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        console.log('Logged in as:', user.name);
    }
}

// 🚪 Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }
}

// 🚀 Initialize
showUserInfo();
renderTasks();
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}