window.onload = async function () {
    const storageData = await getDataFromStorage(null);
    const email = storageData['app_email'];

    console.log(email, storageData);

    // Check if the user has signed in
    if (email) {
        // renderSettings()
    } else {
        renderSignupForm();
        sendMessageToForeground('hello from popup.js');
    }
};


async function handleInit() {
    const initBtn = document.getElementById('app_start');
    sendMessageToForeground('app_init');

    return;
}

async function handleSignup(signupForm) {
    const formData = new FormData(signupForm);
    logFormData(formData);
    const signupBtn = document.getElementById('signupBtn');
    signupBtn.innerText = 'Registering ...';

    const url = `${BACKEND_URL}/create-user`;
    console.log('URL : ', url);
    const data = JSON.stringify(Object.fromEntries(formData));

    const res = await POST(url, data);
    if (
        res.status === 200 ||
        res.msg === 'User is registered.' ||
        res.msg === 'This email is already registered.'
    ) {
        removeHTMLElement(signupForm);
        setDataToStorage('remark_email', JSON.parse(data)['email']);
        renderUserStats();
        signupBtn.innerText = 'Register';
        return;
    }
}

async function handleSignout() {
    // setDataToStorage('', null);

    const tab = await getCurrentTab();

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            location.reload();
        }
    });

    window.close();
}


// ****************** HTTP methods *****************

async function POST(url, data, options) {
    let contentType = options.contentType
        ? options.contentType
        : 'application/json';
    try {
        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': contentType
            },
            body: data
        });

        res = await res.json();
        return res;
    } catch (e) {
        console.log('ERROR IN POST REQUEST : ', e.message);
    }
}

async function GET(url, options) {
    try {
        let res = await fetch(url, options);
        res = await res.json();
        return res;
    } catch (e) {
        console.log('ERROR IN GET REQUEST : ', e.message);
    }
}

// ****************** Chrome APIs ******************

async function getCurrentTab() {
    let queryOptions = { active: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

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
    let k = null;
    if (key !== null) {
        k = [key];
    }
    return new Promise((resolve) => {
        chrome.storage.local.get(k, function (res) {
            resolve(res);
        });
    });
}

function clearDataFromStorage(keys = [], all = true) {
    if (all === true) {
        chrome.storage.local.clear(function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
    } else {
        chrome.storage.local.remove(keys, function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
    }
}

function sendMessageToForeground(message) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            from: 'popup',
            message: message
        });
    });
}

// *************** Utility functions ***************

function logFormData(formData) {
    for (let e of Array.from(formData)) {
        console.log(e[0], ' : ', e[1]);
    }
}

function validateForm(formData) {
    let pattern;
    for (let e of Array.from(formData)) {
        let k = e[0];
        let v = String(e[1]);

        if (v.length > 0) {
            v = v.toLowerCase();
            if (k === 'username') {
                // Only letters and numbers
                pattern = /^[a-zA-Z0-9]+$/;
                return pattern.test(v);
            } else if (k === 'password') {
                /*  Min 8 letter password, with at least a symbol, 
            upper and lower case letters and a number
        */
                pattern =
                    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                return pattern.test(v);
            } else if (k === 'email') {
                pattern =
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(v);
            }
        } else {
            return false;
        }
    }
}

function removeHTMLElement(ele) {
    if (ele && ele.parentElement) {
        ele.parentElement.removeChild(ele);
    }
    return;
}
