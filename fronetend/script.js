const apiUrl = 'http://localhost:3000';


const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
    registerBtn.addEventListener('click', register);
}

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', login);
}


const updatePasswordBtn = document.getElementById('update-password-btn');
if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener('click', updatePassword);
}

const deleteUserBtn = document.getElementById('delete-user-btn');
if (deleteUserBtn) {
    deleteUserBtn.addEventListener('click', deleteUser);
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Please enter username and password.'); 
        return; 
    }
    sendRequest('POST', '/register', { username, password })
        .then(data => {
            document.getElementById('response').innerText = data.message;
            document.getElementById('username').value = ''; 
            document.getElementById('password').value = ''; 
        })
        .catch(error => {
            document.getElementById('response').innerText = 'Registration failed. ' + error.message;
        });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Please enter username and password.'); 
        return; 
    }
    sendRequest('POST', '/login', { username, password })
        .then(data => {
            if (data.message === 'Login successful') {
                window.location.href = 'manage.html';
            } else {
                if (data.message === 'Username or password is wrong') {
                    alert('Username or password is wrong'); 
                    document.getElementById('response').innerText = '';  
                } else {
                    document.getElementById('response').innerText = 'Login failed. ' + data.message;
                }
            }
        })
        .catch(error => {
            document.getElementById('response').innerText = 'Login failed. ' + error.message;
        });
}


function updatePassword() {
    const username = document.getElementById('username').value;
    const newPassword = document.getElementById('newPassword').value;
    if (!username || !newPassword) {
        alert('Please enter username and new password.'); 
        return; 
    }
    sendRequest('PUT', '/update', { username, newPassword })
        .then(data => {
            document.getElementById('response').innerText = data.message;
            document.getElementById('username').value = ''; 
            document.getElementById('password').value = ''; 
        })
        .catch(error => {
            document.getElementById('response').innerText = 'Update failed. ' + error.message;
        });
}

function deleteUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Please enter username and password.'); 
        return; 
    }
    sendRequest('DELETE', '/delete', { username, password })
        .then(data => {
            document.getElementById('response').innerText = data.message;
            document.getElementById('username').value = ''; 
            document.getElementById('password').value = ''; 
        })
        .catch(error => {
            document.getElementById('response').innerText = 'Delete failed. ' + error.message;
        });
}

function sendRequest(method, path, data) {
    return fetch(apiUrl + path, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .catch(error => {
        return error.text().then(errorMessage => {
            throw new Error(errorMessage);
        });
    });
}
