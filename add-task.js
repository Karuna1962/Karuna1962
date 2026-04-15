// 🔐 Authentication Check
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// 📅 DATE SETUP
const dueInput = document.getElementById('dueDate');

// Get current date-time
function getCurrentDateTime() {
    const now = new Date();

    // add 5 minutes buffer
    now.setMinutes(now.getMinutes() + 5);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const formatted = getCurrentDateTime();

if (dueInput) {
    dueInput.value = formatted;   // ✅ FIXED
    dueInput.min = formatted;     // ✅ IMPORTANT FIX
}


// 📝 FORM SUBMIT
const form = document.getElementById('taskForm');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const taskName = document.getElementById('taskName').value.trim();

        // ✅ Validation
        if (!taskName) {
            alert("⚠️ Task name is required");
            return;
        }

        if (!dueInput.value) {
            alert("⚠️ Please select a valid date & time");
            return;
        }

        const task = {
            id: Date.now(),
            name: taskName,
            priority: document.getElementById('priority').value,
            dueDate: dueInput.value,
            description: document.getElementById('description').value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
        tasks.unshift(task);
        localStorage.setItem('studyTasks', JSON.stringify(tasks));

        // ✅ SUCCESS MESSAGE
        const msg = document.getElementById('successMsg');
        if (msg) msg.style.display = 'block';

        // RESET FORM
        form.reset();

        // ✅ RESET DATE AGAIN (IMPORTANT FIX)
        dueInput.value = getCurrentDateTime();

        // REDIRECT
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// 🚪 LOGOUT
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }
}

// 🍔 NAVBAR TOGGLE (SAFE FIX)
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}