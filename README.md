# Jack - AI Chatbot Plugin

<br>

This is a Chrome extension that provides a powerful AI chatbot to talk to. It leverages the **OpenAI's Chat API** ( `gpt3.5-turbo` ) and answers questions related to the **site that you are currently at**.

<br>

# Techonologies Used

- **Frontend** : `HTML5`, `CSS3`, `JavaScript`
- **Backend** : `NodeJS`, `ExpressJS`, `MongoDB`

<br>

# Setup

1. Clone the repository

```bash
    git clone https://github.com/Vishvam10/jack-chatbot-plugin.git
```

2. Go to backend folder

```bash
    cd backend
```

3. Install all the packages 

```bash
    npm install
```

4. Run the server 

```bash
    npm start
```


5. Open Google Chrome and type `chrome://extensions/` on the search bar. This will open the extensions page

6. Click on `Developer Mode` to enable it

7. Click on `Load Unpacked`. A file upload popup would appear. Choose the `chrome_extension` folder

8. Just for the sake of it, update and reload it a couple of times. Now, the extension would have loaded and you are good to go

9. Click on the extension icon. This will launch the bot.

# Todo

<br>

- [x] Session-based login
- [x] History automatically populates
- [x] Doc to right by default
- [x] Restrict all prompt output to less than 100 words unless otherwise specified
- [x] Enter to send and shift + enter for 
