* Settings *
Library           RequestsLibrary

* Variables *
${BASE_URL}       http://localhost:3000

* Test Cases *
Register User
    ${session}=    Create Session    session    ${BASE_URL}
    &{data}=    Create Dictionary    username=testuser    password=testpass
    ${response}=    POST On Session    session    /register    json=${data}
    Check Response Code    ${response.status_code}    200

Login User
    ${session}=    Create Session    session    ${BASE_URL}
    &{data}=    Create Dictionary    username=testuser    password=testpass
    ${response}=    POST On Session    session    /login    json=${data}
    Check Response Code    ${response.status_code}    200

Update User Password
    ${session}=    Create Session    session    ${BASE_URL}
    &{data}=    Create Dictionary    username=testuser    newPassword=newpass123
    ${response}=    PUT On Session    session    /update    json=${data}
    Check Response Code    ${response.status_code}    200

Delete User
    ${session}=    Create Session    session    ${BASE_URL}
    &{data}=    Create Dictionary    username=testuser    password=testpass
    ${response}=    DELETE On Session    session    /delete    json=${data}
    Check Response Code    ${response.status_code}    200

Get All Users
    ${session}=    Create Session    session    ${BASE_URL}
    ${response}=    GET On Session    session    /users
    Check Response Code    ${response.status_code}    200

* Keywords *
Check Response Code
    [Arguments]    ${actual_code}    ${expected_code}
    Run Keyword If    '${actual_code}' != '${expected_code}'    Fail    Expected status code to be '${expected_code}' but was '${actual_code}'.
