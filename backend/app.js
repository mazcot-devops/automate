const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

let users = {};

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }
    if (users[username]) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users[username] = { password };
    return res.status(200).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: 'Username or password is wrong' });
    }
    return res.status(200).json({ message: 'Login successful' });
});

app.put('/update', (req, res) => {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
        return res.status(400).json({ message: 'Missing username or new password' });
    }
    if (!users[username]) {
        return res.status(400).json({ message: 'User does not exist' });
    }
    if (users[username].password === newPassword) {
        return res.status(400).json({ message: 'New password cannot be the same as the old password' });
    }
    users[username].password = newPassword;
    return res.status(200).json({ message: 'Password updated successfully' });
});

app.delete('/delete', (req, res) => {
    const { username, password } = req.body;
    if (!users[username]) {
        return res.status(400).json({ message: 'User does not exist' });
    }
    if (users[username].password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    delete users[username];
    return res.status(200).json({ message: 'User deleted successfully' });
});

app.get('/users', (req, res) => {
    const userList = Object.keys(users).map(username => ({ username }));
    res.status(200).json(userList);
});

app.get('/status', (req, res) => {
    res.status(200).json({ message: 'API is working' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
