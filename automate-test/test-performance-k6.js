import http from 'k6/http';
import { check } from 'k6';

export let options = {
    stages: [
        { duration: '20s', target: 10 }, 
        { duration: '30s', target: 50 }, 
        { duration: '1m', target: 100 },
        { duration: '30s', target: 70 }, 
        { duration: '20s', target: 40 }, 
        { duration: '30s', target: 0 }, 
    ],
};

export default function () {
    let username = `user_${__VU}`;
    let password = 'test_password';
    let newUserParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

  
    let startTime = new Date();
    let registerRes = http.post(`http://localhost:3000/register`, JSON.stringify({ username, password }), newUserParams);
    let endTime = new Date();
    let registerTime = endTime - startTime;

    check(registerRes, {
        'is status 200': (r) => r.status === 200,
        'is user registered': (r) => r.body.indexOf('User registered successfully') !== -1,
    });

    console.log(`Register time for user ${username}: ${registerTime} ms`);

    
    startTime = new Date();
    let loginRes = http.post(`http://localhost:3000/login`, JSON.stringify({ username, password }), newUserParams);
    endTime = new Date();
    let loginTime = endTime - startTime;

    check(loginRes, {
        'is status 200': (r) => r.status === 200,
        'is login successful': (r) => r.body.indexOf('Login successful') !== -1,
    });

    console.log(`Login time for user ${username}: ${loginTime} ms`);

    
    startTime = new Date();
    let newPassword = `${password}_new`;
    let updateRes = http.put(`http://localhost:3000/update`, JSON.stringify({ username, newPassword }), newUserParams);
    endTime = new Date();
    let updateTime = endTime - startTime;

    check(updateRes, {
        'is status 200': (r) => r.status === 200,
        'is password updated': (r) => r.body.indexOf('Password updated successfully') !== -1,
    });

    console.log(`Update password time for user ${username}: ${updateTime} ms`);

    
    startTime = new Date();
    let deleteRes = http.del(`http://localhost:3000/delete`, JSON.stringify({ username, password: newPassword }), newUserParams);
    endTime = new Date();
    let deleteTime = endTime - startTime;

    check(deleteRes, {
        'is status 200': (r) => r.status === 200,
        'is user deleted': (r) => r.body.indexOf('User deleted successfully') !== -1,
    });

    console.log(`Delete user time for user ${username}: ${deleteTime} ms`);
}
