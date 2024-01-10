const apiUrl = 'http://localhost:3000';

const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const changePasswordBtn = document.getElementById('change-password-btn');
const deleteUserBtn = document.getElementById('delete-user-btn');
const checkResponseBtn = document.getElementById('check-response-btn');
const backButton = document.getElementById('back-btn');
const loginToggleBtn = document.getElementById('login-toggle-btn');
const registerToggleBtn = document.getElementById('register-toggle-btn');

let isLoggedIn = false; 

if (registerBtn) {
    registerBtn.addEventListener('click', register);
}

if (loginBtn) {
    loginBtn.addEventListener('click', login);
}

if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', changePassword);
}

if (deleteUserBtn) {
    deleteUserBtn.addEventListener('click', confirmDeleteUser);
}

if (checkResponseBtn) {
    checkResponseBtn.addEventListener('click', checkApiResponse);
}

if (backButton) {
    backButton.style.display = 'none';
    backButton.addEventListener('click', goBack);
}

if (loginToggleBtn) {
    loginToggleBtn.addEventListener('click', toggleLoginRegister);
}

if (registerToggleBtn) {
    registerToggleBtn.addEventListener('click', toggleLoginRegister);
}

function register() {
    const username = document.getElementById('register-username')?.value;
    const password = document.getElementById('register-password')?.value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    sendRequest('POST', '/register', { username, password })
        .then(data => {
            alert(data.message);
            showBackButton();
            hideForm('registerForm');
            showForm('loginForm');
            isLoggedIn = true; 
        })
        .catch(error => {
            alert('Registration failed: ' + error.message);
        });
}

function login() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');

    if (!usernameInput || !passwordInput) {
        alert('Please enter both username and password.');
        return;
    }

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!isLoggedIn) {
        alert('User is not registered');
        return;
    }

    sendRequest('POST', '/login', { username, password })
        .then(data => {
            alert(data.message);
            showBackButton();
            hideForm('loginForm');
            showForm('changePasswordForm');
        })
        .catch(error => {
            alert('Login failed: ' + error.message);
        });
}

// Update password function
function changePassword() {
    const username = document.getElementById('change-username')?.value;
    const newPassword = document.getElementById('change-password')?.value;

    if (!username || !newPassword) {
        alert('Please enter username and new password.');
        return;
    }

    sendRequest('PUT', '/update', { username, newPassword })
        .then(data => {
            alert(data.message);
            showForm('deleteUserForm');
            showForm('checkResponseForm');
            hideForm('changePasswordForm');
        })
        .catch(error => {
            alert('Change password failed: ' + error.message);
        });
}

// Confirm delete user function
function confirmDeleteUser() {
    const username = document.getElementById('delete-username')?.value;
    const password = document.getElementById('delete-password')?.value;

    if (confirm('Are you sure you want to delete the user?')) {
        deleteUser(username, password);
    }
}

// Delete user function
function deleteUser(username, password) {
    sendRequest('DELETE', '/delete', { username, password })
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            alert('Delete failed: ' + error.message);
        });
}

// Check API response function
function checkApiResponse() {
    sendRequest('GET', '/status')
        .then(data => {
            alert('API Status: ' + data.message);
        })
        .catch(error => {
            alert('API check failed: ' + error.message);
        });
}

// Function to send requests to the API
function sendRequest(method, path, data) {
    const fetchOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        fetchOptions.body = JSON.stringify(data);
    }

    return fetch(apiUrl + path, fetchOptions)
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => Promise.reject(error));
            }
            return response.json();
        })
        .catch(error => {
            throw new Error(error.message);
        });
}

// Function to show a form by its ID
function showForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.style.display = 'block';
    }
}

// Function to hide a form by its ID
function hideForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.style.display = 'none';
    }
}

// Function to show the back button
function showBackButton() {
    const backButton = document.getElementById('back-btn');
    if (backButton) {
        backButton.style.display = 'block';
    }
}

// Function to handle the "Go Back" action
function goBack() {
    const forms = ['registerForm', 'loginForm', 'changePasswordForm', 'deleteUserForm', 'checkResponseForm'];
    for (let i = 1; i < forms.length; i++) {
        const currentForm = document.getElementById(forms[i]);
        const previousForm = document.getElementById(forms[i - 1]);

        if (currentForm && previousForm && currentForm.style.display !== 'none') {
            currentForm.style.display = 'none';
            previousForm.style.display = 'block';

            if (i === 1) {
                const backButton = document.getElementById('back-btn');
                if (backButton) {
                    backButton.style.display = 'none';
                }
            }

            break;
        }
    }
}

// Function to toggle between login and register forms
function toggleLoginRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm && registerForm) {
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    }
}
