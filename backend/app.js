const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let users = {};


app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }
    if (users[username]) {
        return res.status(400).send('User already exists');
    }
    users[username] = { password };
    return res.status(200).send('User registered successfully');
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!users[username] || users[username].password !== password) {
        return res.status(401).send('Invalid credentials');
    }
    return res.status(200).send('Login successful');
});


app.put('/update', (req, res) => {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
        return res.status(400).send('Missing username or new password');
    }
    if (!users[username]) {
        return res.status(400).send('User does not exist');
    }
    if (users[username].password === newPassword) {
        return res.status(400).send('New password cannot be the same as the old password');
    }
    users[username].password = newPassword;
    return res.status(200).send('Password updated successfully');
});

app.delete('/delete', (req, res) => {
    const { username, password } = req.body;
    if (!users[username]) {
        return res.status(400).send('User does not exist');
    }
    if (users[username].password !== password) {
        return res.status(401).send('Invalid credentials');
    }
    delete users[username];
    return res.status(200).send('User deleted successfully');
});


app.get('/users', (req, res) => {
    const userList = Object.keys(users).map(username => ({ username }));
    res.status(200).json(userList);
});


app.get('/status', (req, res) => {
    res.status(200).send('API is working');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
