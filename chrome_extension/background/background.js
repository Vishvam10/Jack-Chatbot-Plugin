chrome.action.onClicked.addListener((tab) => {
  console.log("tab id : ", tab.id)
  chrome.scripting.insertCSS({
    target: {tabId: tab.id},
    files: ["foreground/contentScript.css"]
  });
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ["foreground/contentScript.js"]
  });
});