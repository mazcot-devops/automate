*** Settings ***
Library           seleniumlibrary

*** Variables ***
${BASE_URL}       http://localhost:3000
${CHROME_DRIVER_PATH}       /path/to/chromedriver

*** Test Cases ***
Register User
    [Tags]    registration
    [Setup]    Open Browser    ${BASE_URL}    chrome    executable_path=${CHROME_DRIVER_PATH}
    Input Text    //*[@id="register-username"]    testuser
    Input Text    //*[@id="register-password"]    testpass
    Click Element    //*[@id="register-btn"]
    Wait Until Element Is Visible    //*[@id="login-username"]
    [Teardown]    Close Browser

Login User
    [Tags]    login
    [Setup]    Open Browser    ${BASE_URL}    chrome    executable_path=${CHROME_DRIVER_PATH}
    Input Text    //*[@id="login-username"]    testuser
    Input Text    //*[@id="login-password"]    testpass
    Click Element    //*[@id="login-btn"]
    Wait Until Element Is Visible    //*[@id="update-username"]
    [Teardown]    Close Browser

Update User Password
    [Tags]    update
    [Setup]    Open Browser    ${BASE_URL}    chrome    executable_path=${CHROME_DRIVER_PATH}
    Input Text    //*[@id="update-username"]    testuser
    Input Text    //*[@id="change-password"]    newpass123
    Click Element    //*[@id="change-password-btn"]
    Wait Until Element Is Visible    //*[@id="delete-username"]
    [Teardown]    Close Browser

Delete User
    [Tags]    delete
    [Setup]    Open Browser    ${BASE_URL}    chrome    executable_path=${CHROME_DRIVER_PATH}
    Input Text    //*[@id="delete-username"]    testuser
    Input Text    //*[@id="delete-password"]    newpass123
    Click Element    //*[@id="delete-user-btn"]
    Wait Until Element Is Visible    //*[@id="register-username"]
    [Teardown]    Close Browser


