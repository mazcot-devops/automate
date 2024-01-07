const apiUrl = 'http://localhost:3000';

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    sendRequest('POST', '/register', { username, password });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    sendRequest('POST', '/login', { username, password });
}

function updatePassword() {
    const username = document.getElementById('username').value;
    const newPassword = document.getElementById('newPassword').value;
    sendRequest('PUT', '/update', { username, newPassword });
}

function deleteUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    sendRequest('DELETE', '/delete', { username, password });
}

function getAllUsers() {
    sendRequest('GET', '/users');
}

function checkStatus() {
    sendRequest('GET', '/status');
}

function sendRequest(method, path, data = null) {
    fetch(apiUrl + path, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response').innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
