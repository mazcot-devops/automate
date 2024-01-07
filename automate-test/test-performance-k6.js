import http from 'k6/http';
import { check } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 }, 
        { duration: '1m', target: 150 }, 
        { duration: '30s', target: 0 }, 
    ],
    output: 'result.json', 
};

export default function () {
    let username = `user_${__VU}`;
    let password = 'test_password';
    let newUserParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    let registerRes = http.post(`http://localhost:3000/register`, JSON.stringify({ username, password }), newUserParams);
    check(registerRes, {
        'is status 200': (r) => r.status === 200,
        'is user registered': (r) => r.body.indexOf('User registered successfully') !== -1,
    });

    let loginRes = http.post(`http://localhost:3000/login`, JSON.stringify({ username, password }), newUserParams);
    check(loginRes, {
        'is status 200': (r) => r.status === 200,
        'is login successful': (r) => r.body.indexOf('Login successful') !== -1,
    });

    let newPassword = `${password}_new`;
    let updateRes = http.put(`http://localhost:3000/update`, JSON.stringify({ username, newPassword }), newUserParams);
    check(updateRes, {
        'is status 200': (r) => r.status === 200,
        'is password updated': (r) => r.body.indexOf('Password updated successfully') !== -1,
    });

    let deleteRes = http.del(`http://localhost:3000/delete`, JSON.stringify({ username, password: newPassword }), newUserParams);
    check(deleteRes, {
        'is status 200': (r) => r.status === 200,
        'is user deleted': (r) => r.body.indexOf('User deleted successfully') !== -1,
    });
}
