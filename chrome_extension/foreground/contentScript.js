var rootElement;
var BASE_API_URL


function init() {

    console.log("init ...")
    
    BASE_API_URL = "http://127.0.0.1:5000/api";
    
    rootElement = document.createElement("div");
    rootElement.id = "jack_app";
    document.body.appendChild(rootElement);
    
    console.log("DOM check : ", rootElement);

    const token = localStorage.getItem("jack_auth_token");
    console.log("token : ", token);
    
    if(token && token.includes("Bearer")) {
        renderChatComponent();
    } else {
        renderLoginComponent();
    }
    

}

// **************** Render functions *****************


function renderLoginComponent() {
    const markup = `
        <div id="jack_login_area">
            <form id="userLoginForm" class="login_signup_form">
                <h3>Login</h3>
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
    `

    console.log("reached1")
    rootElement.insertAdjacentHTML("afterbegin", markup);
    console.log("reached2")

    const loginBtn = document.getElementById("loginBtn");
    const loginSignupSwitchBtn = document.getElementById("loginSignupSwitchBtn");

    loginBtn.addEventListener("click", handleLogin);
    loginSignupSwitchBtn.addEventListener("click", handleLoginSignupSwitch);

    console.log("reached")

}

function renderSignupComponent() {
    const markup = `
        <div id="jack_signup_area">
            <form id="userSignupForm">
                <h3>Sign Up</h3>
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
    `

    rootElement.insertAdjacentHTML("afterbegin", markup);

    const signupBtn = document.getElementById("signupBtn");
    const loginSignupSwitchBtn = document.getElementById("loginSignupSwitchBtn");

    signupBtn.addEventListener("click", handleSignup);
    loginSignupSwitchBtn.addEventListener("click", handleLoginSignupSwitch)

}

function renderChatComponent() {
    const markup = `   
        <div id="jack_chat_area">
            <div class="jack_chat_header">
                <h3 class="jack_chat_header_heading">Jack</h3>
                <span id="minimizeBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><polyline points="112 184 256 328 400 184" style="stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>
                </span>
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
    `

    rootElement.insertAdjacentHTML("afterbegin", markup);

    const sendBtn = document.getElementById("sendBtn");
    sendBtn.addEventListener("click", handleMessageSubmit);

    const minimizeBtn = document.getElementById("minimizeBtn");
    minimizeBtn.addEventListener("click", handleMinimize)

}

// **************** Handler functions ****************


function handleLoginSignupSwitch() {

    const loginArea = document.getElementById("jack_login_area");
    const signupArea = document.getElementById("jack_signup_area");

    if(loginArea) {
        removeHTMLElement(loginArea);
        renderSignupComponent();
        return;
    } 

    if(signupArea) {
        removeHTMLElement(signupArea);
        renderLoginComponent();
        return;
    }

}


function handleMinimize() {
    
    const chatArea = document.getElementById("jack_chat_area");
    chatArea.classList.add("jack_hide");

    rootElement.classList.add("jack_minimized");

    const check = document.getElementById("maximizeBtn");
    if(!check) {
        const markup = `
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" id="maximizeBtn" viewBox="0 0 512 512"><polyline points="112 328 256 184 400 328" style="stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>
        `
        
        rootElement.insertAdjacentHTML("afterbegin", markup);
    }


    const maximizeBtn = document.getElementById("maximizeBtn");
    maximizeBtn.addEventListener("click", handleMaximize);
    
}

function handleMaximize() {
    const maximizeBtn = document.getElementById("maximizeBtn");
    removeHTMLElement(maximizeBtn)

    const chatArea = document.getElementById("jack_chat_area");
    chatArea.classList.remove("jack_hide");

    rootElement.classList.remove("jack_minimized");
}


async function handleLogin() {

    const email = rootElement.querySelector(".inp_email").value;
    const password = rootElement.querySelector(".inp_password").value;

    if(email == "" || password == "") {
        return
    }

    const url = `${BASE_API_URL}/auth/login`;

    console.log(email, password, url)

    let res = await fetch(url, {
        method: "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            "email" : email,
            "password" : password
        })
    })

    res = await res.json();

    if("error" in res) {
        console.log("login failed : ", res.error);
        return;
    } else {
        localStorage.setItem("jack_auth_token", res.token);
    }
}

async function handleSignup() {
    const username = rootElement.querySelector(".inp_username").value;
    const email = rootElement.querySelector(".inp_email").value;
    const password = rootElement.querySelector(".inp_password").value;

    if(email == "" || password == "" || username == "") {
        return
    }

    const url = `${BASE_API_URL}/auth/register`;

    console.log(username, password, email, url)

    
}

async function handleMessageSubmit() {

    const message = document.querySelector(".jack_input_message_wrapper_text").textContent;
    const container = document.getElementById("jack_chat_messages_container");

    console.log(message);

    if(message == "") {
        return;
    }


    let markup = `
        <div class="jack_chat_message_container">
            <div class="jack_chat_message_box sender_message">
                <p class="jack_chat_message">${message}</p>
            </div>
            <span class="jack_chat_message_time sender_time">Now</span>
        </div>

    `

    container.insertAdjacentHTML("beforeend", markup);

    // TODO : Chat GPT API
    // const url = `${BASE_API_URL}/api/chat`;

    // let res = await fetch(url, {
    //     method: "POST",
    //     headers : {
    //         "Content-Type" : "application/json"
    //     },
    //     body: JSON.stringify({
    //         "domain" : domain,
    //         "message" : message
    //     })
    // })

    // res = await res.json();
    // let response = res["message"]

    let response = "Yo good question !";

    setTimeout(() => {
        markup = `
            <div class="jack_chat_message_container">
                <div class="jack_chat_message_box">
                    <p class="jack_chat_message">${response}</p>
                </div>
                <span class="jack_chat_message_time">Now</span>
            </div>
        `;
    
        container.insertAdjacentHTML("beforeend", markup);
    }, 2500)

    container.scrollTo(0, container.scrollHeight);

    

    return;

}


// **************** Utility functions ****************


function removeHTMLElement(ele) {
    if(ele) {
        ele.parentNode.removeChild(ele);
    }
    return;
}

init();