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


    // const m = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. This AI assistant answers queries specific to https://niituniversity.in";

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
        
        // console.log(user.chatData[chatDataIndex])
        user.chatData[chatDataIndex].chats.push({ prompt, response });
        
        // Save the updated user object to the database
        await user.save();
        
        // Return the updated user object as the response
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

});


module.exports = router;