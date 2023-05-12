var BASE_API_URL;

var rootElement;
var messages_history = [];

(async () => {
    console.log('init ...');

    BASE_API_URL = 'http://127.0.0.1:5000/api';

    rootElement = document.createElement('div');
    rootElement.id = 'jack_app';
    document.body.appendChild(rootElement);

    console.log('DOM check : ', rootElement);

    let token  = await getDataFromStorage('jack_auth_token');
    token = token['jack_auth_token'];

    if (token) {
        renderChatComponent();
    } else {
        renderLoginComponent();
    }
})()

// **************** Render functions *****************

function renderLoginComponent() {
    const markup = `
        <div id="jack_login_area">
            <form id="userLoginForm" class="login_signup_form">
                <h3 class="jack_h3">Login</h3>
                <div>
                    <label for="email" class="jack_form_label">Email</label>
                    <input type="email" id="email"  name="email" class="jack_form_input inp_email" placeholder="Enter your email ID">
                    <label for="password" class="jack_form_label">Password</label>
                    <input type="password" id="password" name="password" class="jack_form_input inp_password" placeholder="Enter your password">
                </div>
                <button type="button" class="jack_standard_button" id="loginBtn">Login</button>
                <p class="login_signup_switch_text">Don't have an account ? <span id="loginSignupSwitchBtn">Create one</span></p>
            </form>
        </div>
    `;

    rootElement.insertAdjacentHTML('afterbegin', markup);

    const loginBtn = document.getElementById('loginBtn');
    const loginSignupSwitchBtn = document.getElementById(
        'loginSignupSwitchBtn'
    );

    loginBtn.addEventListener('click', handleLogin);
    loginSignupSwitchBtn.addEventListener('click', handleLoginSignupSwitch);
}

function renderSignupComponent() {
    const markup = `
        <div id="jack_signup_area">
            <form id="userSignupForm">
                <h3 class="jack_h3">Sign Up</h3>
                <div>
                    <label for="username" class="jack_form_label">Username</label>
                    <input type="username" id="username" name="username" class="jack_form_input inp_username" placeholder="Enter your email ID">
                    <label for="email" class="jack_form_label">Email</label>
                    <input type="email" id="email" name="email" class="jack_form_input inp_email" placeholder="Enter your email ID">
                    <label for="password" class="jack_form_label">Password</label>
                    <input type="password" id="password" name="password" class="jack_form_input inp_password" placeholder="Enter your password">
                </div>
                <button type="button" class="jack_standard_button" id="signupBtn">Register</button>
                <p class="login_signup_switch_text">Already have an account ? <span id="loginSignupSwitchBtn">Log in</span></p>
            </form>
        </div>
    `;

    rootElement.insertAdjacentHTML('afterbegin', markup);

    const signupBtn = document.getElementById('signupBtn');
    const loginSignupSwitchBtn = document.getElementById(
        'loginSignupSwitchBtn'
    );

    signupBtn.addEventListener('click', handleSignup);
    loginSignupSwitchBtn.addEventListener('click', handleLoginSignupSwitch);
}

function renderChatComponent() {

    const check = document.getElementById("jack_chat_area");
    removeHTMLElement(check);

    const username = "Sample"

    const markup = `   
        <div id="jack_chat_area">
            <div class="jack_chat_header">
                <h3 class="jack_chat_header_heading">Hello, ${username} !</h3>
                <div class="jack_action_container">
                    <span id="deleteHistoryBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" style="width: 22px !important; height: 20px !important"><path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="stroke-linejoin:round;stroke-width:32px"/><line x1="80" y1="112" x2="432" y2="112" style="stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"/><path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="stroke-linejoin:round;stroke-width:32px"/><line x1="256" y1="176" x2="256" y2="400" style="stroke-linejoin:round;stroke-width:32px"/><line x1="184" y1="176" x2="192" y2="400" style="stroke-linejoin:round;stroke-width:32px"/><line x1="328" y1="176" x2="320" y2="400" style="stroke-linejoin:round;stroke-width:32px"/></svg>
                    </span>
                    <span id="logoutBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M304,336v40a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V136a40,40,0,0,1,40-40H256c22.09,0,48,17.91,48,40v40" style="stroke-linejoin:round;stroke-width:32px; width: 22px !important;"/>
                        <polyline points="368 336 448 256 368 176" style="stroke-linejoin:round;stroke-width:32px"/>
                        <line x1="176" y1="256" x2="432" y2="256" style="stroke-linejoin:round;stroke-width:32px"/></svg>
                    </span>
                    <span id="minimizeBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><polyline points="112 184 256 328 400 184" style="stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>
                    </span>
                </div>
            </div>
            <div id="jack_chat_messages_container">
            </div>
            <div class="jack_chat_input_container">
                <div class="jack_input_message_wrapper">
                    <div class="jack_input_message_wrapper_text" contentEditable></div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" id="sendBtn">
                    <path d="M53.12,199.94l400-151.39a8,8,0,0,1,10.33,10.33l-151.39,400a8,8,0,0,1-15-.34L229.66,292.45a16,16,0,0,0-10.11-10.11L53.46,215A8,8,0,0,1,53.12,199.94Z" style="stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
                    <line x1="460" y1="52" x2="227" y2="285" style="stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
                </svg>
            </div>
        </div>
    `;

    rootElement.insertAdjacentHTML('afterbegin', markup);

    const inpArea = document.querySelector('.jack_input_message_wrapper_text');
    inpArea.addEventListener('keypress', (e) => {
        if(e.shiftKey && e.key == 'Enter') {
            console.log("shift + enter")
        } else if(e.key == 'Enter') {
            console.log("enter");
            handleMessageSubmit();
        }
    })

    const sendBtn = document.getElementById('sendBtn');
    sendBtn.addEventListener('click', handleMessageSubmit);

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', handleLogout);

    const deleteHistoryBtn = document.getElementById('deleteHistoryBtn');
    deleteHistoryBtn.addEventListener("click", handleDeleteHistory)

    const minimizeBtn = document.getElementById('minimizeBtn');
    minimizeBtn.addEventListener('click', handleMinimize);

    handlePopulateHistory();

}

// **************** Handler functions ****************

function handleLoginSignupSwitch() {
    const loginArea = document.getElementById('jack_login_area');
    const signupArea = document.getElementById('jack_signup_area');

    if (loginArea) {
        removeHTMLElement(loginArea);
        renderSignupComponent();
        return;
    }

    if (signupArea) {
        removeHTMLElement(signupArea);
        renderLoginComponent();
        return;
    }
}

function handleMinimize() {
    const chatArea = document.getElementById('jack_chat_area');
    chatArea.classList.add('jack_hide');

    rootElement.classList.add('jack_minimized');

    const check = document.getElementById('maximizeBtn');
    if (!check) {
        const markup = `
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" id="maximizeBtn" viewBox="0 0 512 512"><polyline points="112 328 256 184 400 328" style="stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>
        `;

        rootElement.insertAdjacentHTML('afterbegin', markup);
    }

    const maximizeBtn = document.getElementById('maximizeBtn');
    maximizeBtn.addEventListener('click', handleMaximize);
}

function handleMaximize() {
    const maximizeBtn = document.getElementById('maximizeBtn');
    removeHTMLElement(maximizeBtn);

    const chatArea = document.getElementById('jack_chat_area');
    chatArea.classList.remove('jack_hide');

    rootElement.classList.remove('jack_minimized');
}

async function handleLogin() {
    const email = rootElement.querySelector('.inp_email').value;
    const password = rootElement.querySelector('.inp_password').value;

    if (email == '' || password == '') {
        return;
    }

    const url = `${BASE_API_URL}/auth/login`;

    console.log(email, password, url);

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    res = await res.json();

    if ('error' in res) {
        console.log('login failed : ', res.error);
        return;
    } else {

        setDataToStorage('jack_auth_token', res.token)

        const loginArea = document.getElementById('jack_login_area');
        removeHTMLElement(loginArea);
        
        renderChatComponent();
    }
}

function handleLogout() {

    deleteDataFromStorage('jack_auth_token');
    
    const chatArea = document.getElementById("jack_chat_area");
    removeHTMLElement(chatArea);

    const actionBtns = document.querySelector("jack_action_container");
    removeHTMLElement(actionBtns)

    renderLoginComponent();
    return;
    
}

async function handleSignup() {
    const username = rootElement.querySelector('.inp_username').value;
    const email = rootElement.querySelector('.inp_email').value;
    const password = rootElement.querySelector('.inp_password').value;

    if (email == '' || password == '' || username == '') {
        return;
    }

    const url = `${BASE_API_URL}/auth/register`;

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    });

    res = await res.json();
    console.log(res);
    if ("message" in res) {
        renderLoginComponent();
    }
}

async function handleMessageSubmit() {
    setTimeout(() => {
        const loadingMarkup = `
            <div class="jack_chat_message_container" id="loadingResponse">
                <div class="jack_chat_message_box">
                    <p class="jack_chat_message">....</p>
                </div>
                <span class="jack_chat_message_time">Now</span>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', loadingMarkup);
        container.scrollTo(0, container.scrollHeight);
    }, 1500);

    const inp = document.querySelector('.jack_input_message_wrapper_text');
    const prompt = inp.textContent;
    const domain = window.location.href;

    console.log("domain : ", domain)

    let token = await getDataFromStorage('jack_auth_token');
    token = token['jack_auth_token']

    const username = "Sample"

    inp.textContent = '';

    const container = document.getElementById('jack_chat_messages_container');

    if (prompt == '') {
        return;
    }

    const userMessageMarkup = `
        <div class="jack_chat_message_container">
            <div class="jack_chat_message_box sender_message">
                <p class="jack_chat_message">${prompt}</p>
            </div>
            <span class="jack_chat_message_time sender_time">${username}</span>
        </div>

    `;

    container.insertAdjacentHTML('beforeend', userMessageMarkup);

    const url = `${BASE_API_URL}/chat`;

    messages_history.push({ role: 'user', content: prompt });

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            domain: domain,
            messages: messages_history
        })
    });

    res = await res.json();
    console.log(res);
    let response = res.data.content;

    messages_history.push({ role: 'assistant', content: response });

    setTimeout(() => {
        const check = document.getElementById('loadingResponse');
        if (check) {
            removeHTMLElement(check);
        }
        const assistantMessageMarkup = `
            <div class="jack_chat_message_container">
                <div class="jack_chat_message_box">
                    <p class="jack_chat_message">${response}</p>
                </div>
                <span class="jack_chat_message_time">Jack</span>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', assistantMessageMarkup);
        container.scrollTo(0, container.scrollHeight);
    }, 1500);

    return;
}

async function handlePopulateHistory() {

    const chatContainer = document.getElementById("jack_chat_messages_container");
    const domain = window.location.hostname;
    let token = await getDataFromStorage('jack_auth_token');
    token = token['jack_auth_token'];

    const url = `${BASE_API_URL}/chat/history/${domain}`;

    let res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    res = await res.json();
    let data = res.data;
    console.log(res, data)
    if(data.length > 0) {
        data.forEach((ele) => {
            
            if(ele.role == 'user') {
                const userMessageMarkup = `
                <div class="jack_chat_message_container">
                <div class="jack_chat_message_box sender_message">
                <p class="jack_chat_message">${ele.content}</p>
                </div>
                <span class="jack_chat_message_time sender_time">Now</span>
                </div>
                `;
                
                chatContainer.insertAdjacentHTML("beforeend", userMessageMarkup);
    
            } else if(ele.role == 'assistant') {
                
                const assistantMessageMarkup = `
                    <div class="jack_chat_message_container">
                        <div class="jack_chat_message_box">
                            <p class="jack_chat_message">${ele.content}</p>
                        </div>
                        <span class="jack_chat_message_time">Now</span>
                    </div>
            
                `;
    
                chatContainer.insertAdjacentHTML("beforeend", assistantMessageMarkup);
    
            }
            
            messages_history.push({ role: ele.role, content: ele.content })
    
        });
    
    }
    
    return;

}

async function handleDeleteHistory() {
    const domain = window.location.hostname;
    let token = await getDataFromStorage('jack_auth_token');
    token = token['jack_auth_token'];

    const url = `${BASE_API_URL}/chat/history/${domain}`;

    let res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    res = await res.json();
    messages_history = [];

    renderChatComponent();
}

// **************** Utility functions ****************

function removeHTMLElement(ele) {
    if (ele) {
        ele.parentNode.removeChild(ele);
    }
    return;
}

// ******************* Chrome APIs *******************

function setDataToStorage(key, value) {
    try {
        // [k] is a computed property.
        // Without it, we can not set dynamic keys.
        chrome.storage.local.set({
            [key]: value
        });
    } catch (e) {
        console.log('CHROME ERROR : ', e.message);
    }
}

function getDataFromStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], function (res) {
            resolve(res);
        });
    });
}

async function deleteDataFromStorage(key) {
    try {
        chrome.storage.local.remove([key]);
        const check = await getDataFromStorage(key);
        console.log("check : ", check)
        return true;
    } catch(e) {
        console.log('CHROME ERROR : ', e.message);
    }
}
