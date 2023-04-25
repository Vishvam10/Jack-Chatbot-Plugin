// chrome.runtime.onConnect.addListener(function (port) {
//   console.log("Connected to injected script:", port);
//   // Listen for data from the injected script
//   port.onMessage.addListener(async function (message) {
//     const data = message;
//     console.log("Received data from injected script:", data);
//     port.postMessage({ result: "" });
//   });
// });

function setDataToStorage(key, value) {
    try {
      // [k] is a computed property.
      // Without it, we can not set dynamic keys.
      chrome.storage.local.set({
        [key]: value,
      });
    } catch (e) {
      console.log("CHROME ERROR : ", e.message);
    }
  }
  
function getDataFromStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], function (res) {
        resolve(res);
        });
    });
}
  