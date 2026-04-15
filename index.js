// AUTH CHECK
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}
function getTasks() {
    return JSON.parse(localStorage.getItem('studyTasks')) || [];
}

// UPDATE STATS
function updateStats() {
    const tasks = getTasks();

    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('highPriority').textContent = tasks.filter(t => t.priority === 'high').length;
}
// FORMAT DATE
function formatDate(date) {
    if (!date) return "No Date";
    return new Date(date).toLocaleDateString();
}

// GET RECENT TASKS
function getRecentTasks() {
    const tasks = getTasks();

    return [...tasks]
        .sort((a, b) => new Date(b.createdAt || b.dueDate) - new Date(a.createdAt || a.dueDate))
        .slice(0, 3);
}

// RENDER TASKS
function renderTasks() {
    const container = document.getElementById('recentTasks');
    const recent = getRecentTasks();

    if (recent.length === 0) {
        container.innerHTML = `<div class="empty-state">No tasks yet</div>`;
        return;
    }

    container.innerHTML = recent.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div>
                <h4>${task.name}</h4>
                <div class="task-meta">
                    ${task.priority?.toUpperCase()} • ${formatDate(task.dueDate)}
                </div>
            </div>
            <a href="tasks.html" class="btn btn-success">View</a>
        </div>
    `).join('');
}

// LOGOUT
function logout() {
    localStorage.removeItem('isLoggedIn');
localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}  

// INIT
updateStats();
renderTasks();
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}
