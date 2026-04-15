const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');
const errorMessage = document.getElementById('errorMessage');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordStrength = document.getElementById('passwordStrength');
const googleSignUpBtn = document.getElementById('googleSignUp');
const facebookSignUpBtn = document.getElementById('facebookSignUp');
const appleSignUpBtn = document.getElementById('appleSignUp');

function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
        case 0:
            return { width: '0%', color: '#ddd', text: 'Enter a password' };
        case 1:
            return { width: '20%', color: '#ef4444', text: 'Very weak' };
        case 2:
            return { width: '40%', color: '#f59e0b', text: 'Weak' };
        case 3:
            return { width: '60%', color: '#10b981', text: 'Fair' };
        case 4:
            return { width: '80%', color: '#3b82f6', text: 'Strong' };
        case 5:
            return { width: '100%', color: '#8b5cf6', text: 'Excellent' };
        default:
            return { width: '0%', color: '#ddd', text: 'Enter a password' };
    }
}

function updatePasswordStrength() {
    if (!passwordInput || !passwordStrength) return;
    const strength = checkPasswordStrength(passwordInput.value);
    const bar = passwordStrength.querySelector('.strength-bar');
    const text = passwordStrength.querySelector('.strength-text');
    if (bar) bar.style.width = strength.width;
    if (bar) bar.style.background = strength.color;
    if (text) text.textContent = strength.text;
}

function updateMessage(message, success = false) {
    if (!errorMessage) return;
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.color = success ? '#065f46' : '#b91c1c';
    errorMessage.style.background = success ? 'rgba(220, 252, 231, 0.95)' : 'rgba(254, 226, 226, 0.95)';
}

function clearMessage() {
    if (!errorMessage) return;
    errorMessage.style.display = 'none';
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function userExists(email) {
    return getUsers().some(user => user.email.toLowerCase() === email.toLowerCase());
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
}

function setLoggedInUser(user) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function validateForm(firstName, lastName, email, password, confirmPassword) {
    clearMessage();

    if (!firstName || firstName.length < 2) {
        updateMessage('First name must be at least 2 characters');
        return false;
    }
    if (!lastName || lastName.length < 2) {
        updateMessage('Last name must be at least 2 characters');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        updateMessage('Please enter a valid email address');
        return false;
    }
    if (password.length < 8) {
        updateMessage('Password must be at least 8 characters');
        return false;
    }
    if (password !== confirmPassword) {
        updateMessage('Passwords do not match');
        return false;
    }
    if (userExists(email)) {
        updateMessage('This email is already registered. Please login instead.');
        return false;
    }
    return true;
}

function toggleLoading(isLoading) {
    if (!signupBtn) return;
    const btnText = signupBtn.querySelector('.btn-text');
    const btnLoader = signupBtn.querySelector('.btn-loader');
    signupBtn.disabled = isLoading;
    if (btnText) btnText.style.opacity = isLoading ? '0' : '1';
    if (btnLoader) btnLoader.classList.toggle('hidden', !isLoading);
}

function handleEmailSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!validateForm(firstName, lastName, email, password, confirmPassword)) {
        return;
    }

    toggleLoading(true);
    setTimeout(() => {
        const user = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        saveUser(user);
        setLoggedInUser(user);
        updateMessage('Account created successfully! Redirecting...', true);
        toggleLoading(false);
        setTimeout(() => window.location.href = 'index.html', 1200);
    }, 600);
}

function validateConfirmPassword() {
    const password = passwordInput?.value || '';
    const confirmPassword = confirmPasswordInput?.value || '';
    if (!confirmPassword) {
        confirmPasswordInput.style.borderColor = '';
        return;
    }
    confirmPasswordInput.style.borderColor = password === confirmPassword ? '#34d399' : '#ef4444';
}

function showSignupAccountChooser(provider) {
    const modal = document.getElementById('signupSocialModal');
    const providerName = document.getElementById('signupProviderName');
    const accountList = document.getElementById('signupAccountList');
    if (!modal || !providerName || !accountList) return;

    const accounts = {
        Google: [
            { name: 'Aisha Patel', email: 'aisha.patel@gmail.com' },
            { name: 'Dev Study', email: 'dev.study@gmail.com' }
        ],
        Facebook: [
            { name: 'Rahul Kumar', email: 'rahul.kumar@facebook.com' },
            { name: 'Priya Sharma', email: 'priya.sharma@facebook.com' }
        ],
        Apple: [
            { name: 'Aarav Singh', email: 'aarav.singh@icloud.com' },
            { name: 'Maya Reddy', email: 'maya.reddy@icloud.com' }
        ]
    }[provider] || [];

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
            completeSocialSignup(provider, name, email);
        });
    });

    modal.classList.remove('hidden');
}

function closeSignupSocialModal() {
    const modal = document.getElementById('signupSocialModal');
    if (modal) modal.classList.add('hidden');
}

function completeSocialSignup(provider, name, email) {
    const user = {
        id: Date.now(),
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || provider,
        email: email || `${provider.toLowerCase()}@studyplanner.local`,
        displayName: name,
        loginType: provider,
        createdAt: new Date().toISOString()
    };
    saveUser(user);
    setLoggedInUser(user);
    updateMessage(`Signed up with ${provider} as ${name}`, true);
    closeSignupSocialModal();
    setTimeout(() => window.location.href = 'index.html', 900);
}

function setupListeners() {
    signupForm?.addEventListener('submit', handleEmailSignup);
    passwordInput?.addEventListener('input', updatePasswordStrength);
    confirmPasswordInput?.addEventListener('input', validateConfirmPassword);
    googleSignUpBtn?.addEventListener('click', () => showSignupAccountChooser('Google'));
    facebookSignUpBtn?.addEventListener('click', () => showSignupAccountChooser('Facebook'));
    appleSignUpBtn?.addEventListener('click', () => showSignupAccountChooser('Apple'));
    updatePasswordStrength();
}

document.addEventListener('DOMContentLoaded', () => {
    setupListeners();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
});