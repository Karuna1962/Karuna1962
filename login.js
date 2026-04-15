document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');

    // Demo login functionality
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Show loading state
        loginBtn.disabled = true;
        btnText.style.opacity = '0';
        btnLoader.classList.remove('hidden');

        // Simulate API call
        setTimeout(() => {
            // Demo successful login (in real app, validate credentials)
            
if (email && password) {
    // ✅ SET LOGIN STATUS
    localStorage.setItem('isLoggedIn', 'true');

    // OPTIONAL: store user info
    localStorage.setItem('currentUser', JSON.stringify({
        email: email
    }));

    window.location.href = 'index.html';
} else {
                alert('Please enter valid credentials');
                resetLoginButton();
            }
        }, 2000);
    });

    function resetLoginButton() {
        loginBtn.disabled = false;
        btnText.style.opacity = '1';
        btnLoader.classList.add('hidden');
    }

    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = btn.dataset.provider;
            if (provider) {
                openSocialAccountChooser(provider);
            }
        });
    });

    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality coming soon!');
    });

    // Auto-focus first input
    document.getElementById('loginEmail').focus();
});

function openSocialAccountChooser(provider) {
    const modal = document.getElementById('socialModal');
    const providerName = document.getElementById('socialProviderName');
    const accountList = document.getElementById('socialAccountList');
    if (!modal || !providerName || !accountList) return;

    const accounts = provider === 'Google'
        ? [
            { name: 'Aisha Patel', email: 'aisha.patel@gmail.com' },
            { name: 'Dev Study', email: 'dev.study@gmail.com' }
        ]
        : [
            { name: 'Rahul Kumar', email: 'rahul.kumar@facebook.com' },
            { name: 'Priya Sharma', email: 'priya.sharma@facebook.com' }
        ];

    providerName.textContent = provider;
    accountList.innerHTML = accounts.map(account => `
        <button type="button" class="modal-account" data-name="${account.name}" data-email="${account.email}">
            <span>${account.name}</span>
            <small>${account.email}</small>
        </button>
    `).join('');

    accountList.querySelectorAll('.modal-account').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const email = button.dataset.email;
            confirmSocialLogin(provider, name, email);
        });
    });

    modal.classList.remove('hidden');
}

function closeSocialModal() {
    const modal = document.getElementById('socialModal');
    if (modal) modal.classList.add('hidden');
}

function confirmSocialLogin(provider, name, email) {
    closeSocialModal();
    const user = {
        name: name || `${provider} User`,
        email: email || `${provider.toLowerCase()}@example.com`,
        loginType: provider,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));

    alert(`${provider} login successful as ${name}`);
    window.location.href = 'index.html';
}