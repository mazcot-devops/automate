import http from 'k6/http';
import { check } from 'k6';

export let options = {
    stages: [
        { duration: '20s', target: 10 }, 
        { duration: '30s', target: 30 }, 
        { duration: '50m', target: 80 },
        { duration: '30s', target: 60 }, 
        { duration: '20s', target: 30 }, 
        { duration: '20s', target: 0 }, 
    ],
};

export let summaryData = {
    registerTime: 0,
    loginTime: 0,
    updateTime: 0,
    deleteTime: 0,
};

export default function () {
    let username = `user_${__VU}`;
    let password = 'test_password';
    let newUserParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    //Register
    let startTime = new Date();
    let registerRes = http.post(`http://localhost:3000/register`, JSON.stringify({ username, password }), newUserParams);
    let endTime = new Date();
    let registerTime = endTime - startTime;

    check(registerRes, {
        'is status 200': (r) => r.status === 200,
        'is user registered': (r) => r.body.indexOf('User registered successfully') !== -1,
    });
    summaryData.registerTime += registerTime;

    //Login
    startTime = new Date();
    let loginRes = http.post(`http://localhost:3000/login`, JSON.stringify({ username, password }), newUserParams);
    endTime = new Date();
    let loginTime = endTime - startTime;

    check(loginRes, {
        'is status 200': (r) => r.status === 200,
        'is login successful': (r) => r.body.indexOf('Login successful') !== -1,
    });
    summaryData.loginTime += loginTime;

    //Change password
    startTime = new Date();
    let newPassword = `${password}_new`;
    let updateRes = http.put(`http://localhost:3000/update`, JSON.stringify({ username, newPassword }), newUserParams);
    endTime = new Date();
    let updateTime = endTime - startTime;

    check(updateRes, {
        'is status 200': (r) => r.status === 200,
        'is password updated': (r) => r.body.indexOf('Password updated successfully') !== -1,
    });
    summaryData.updateTime += updateTime;

    //Delete user
    startTime = new Date();
    let deleteRes = http.del(`http://localhost:3000/delete`, JSON.stringify({ username, password: newPassword }), newUserParams);
    endTime = new Date();
    let deleteTime = endTime - startTime;

    check(deleteRes, {
        'is status 200': (r) => r.status === 200,
        'is user deleted': (r) => r.body.indexOf('User deleted successfully') !== -1,
    });
    summaryData.deleteTime += deleteTime;
}
