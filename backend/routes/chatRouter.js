const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');

const User = require("../models/User")

const responses = [
    'Yes, definitely.',
    'It is decidedly so.',
    'Without a doubt.',
    'Most likely.',
    'Outlook good.',
    'Reply hazy, try again.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Don\'t count on it.',
    'Outlook not so good.'
  ];
  

router.post("/", async (req, res) => {
    const token = req.headers.authorization.split("Bearer")[2].trim();
    const domain = req.body.domain;
    const prompt = req.body.prompt;

    const decodedToken = jwt.decode(token);
    const userid = decodedToken.id;

    if(prompt == "" || domain == "") {
        return res.status(400).json({ error: "Prompt or domain is empty" });
    }

    const randomIndex = Math.floor(Math.random() * responses.length);
    const response = responses[randomIndex];

    try {

        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Check if chat data for domain already exists
        let chatDataIndex = user.chatData.findIndex((chatData) => chatData.domain === domain);
        if (chatDataIndex === -1) {
            user.chatData.push({ domain, chats: [] }); 
        }
        
        chatDataIndex = user.chatData.findIndex((chatData) => chatData.domain === domain);
        user.chatData[chatDataIndex].chats.push({ prompt, response });
        
        await user.save();
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

});


module.exports = router;