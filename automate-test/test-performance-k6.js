import http from 'k6/http';
import { check, Trend } from 'k6';
import { Trend } from 'k6/metrics';



const durationRegister = new Trend('duration_register');
const durationLogin = new Trend('duration_login');
const durationUpdate = new Trend('duration_update');
const durationDelete = new Trend('duration_delete');

export let options = {
    stages: [
        { duration: '20s', target: 10 }, 
        { duration: '1m', target: 300 }, 
        { duration: '2m', target: 500 },
        { duration: '30s', target: 100 }, 
        { duration: '30s', target: 50 }, 
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
    
 
    let startRegister = Date.now();
    let registerRes = http.post(`http://localhost:3000/register`, JSON.stringify({ username, password }), newUserParams);
    durationRegister.add(Date.now() - startRegister);
    check(registerRes, {
        'is status 200': (r) => r.status === 200,
        'is user registered': (r) => r.body.indexOf('User registered successfully') !== -1,
    });

    
    let startLogin = Date.now();
    let loginRes = http.post(`http://localhost:3000/login`, JSON.stringify({ username, password }), newUserParams);
    durationLogin.add(Date.now() - startLogin);
    check(loginRes, {
        'is status 200': (r) => r.status === 200,
        'is login successful': (r) => r.body.indexOf('Login successful') !== -1,
    });

    
    let newPassword = `${password}_new`;
    let startUpdate = Date.now();
    let updateRes = http.put(`http://localhost:3000/update`, JSON.stringify({ username, newPassword }), newUserParams);
    durationUpdate.add(Date.now() - startUpdate);
    check(updateRes, {
        'is status 200': (r) => r.status === 200,
        'is password updated': (r) => r.body.indexOf('Password updated successfully') !== -1,
    });

    
    let startDelete = Date.now();
    let deleteRes = http.del(`http://localhost:3000/delete`, JSON.stringify({ username, password: newPassword }), newUserParams);
    durationDelete.add(Date.now() - startDelete);
    check(deleteRes, {
        'is status 200': (r) => r.status === 200,
        'is user deleted': (r) => r.body.indexOf('User deleted successfully') !== -1,
    });
}
