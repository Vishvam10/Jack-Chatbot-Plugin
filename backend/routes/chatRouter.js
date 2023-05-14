const express = require("express");
const router = express.Router();
require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}))
  
router.post("/", async (req, res) => {
    const token = req.headers.authorization.split("Bearer")[1].trim();
    const domain = req.body.domain;
    let messages = req.body.messages;

    const decodedToken = jwt.decode(token);
    const userid = decodedToken.id;

    if(domain == "") {
        return res.status(400).json({ error: "Prompt or domain is empty" });
    }

    const systemPrompt = `You are Jack, an enthusiastic, and an accurate chatbot. You will answer subsequent questions that are related to this domain : ${domain} only. Please refrain from answering any other questions. Do not answer any questions that are not related to ${domain}. Answer in 100 words or less unless specified otherwise.`
   
   
    messages = [
        { role: "system", content: systemPrompt },
        ...messages
    ]

    let response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    })

    const currentMessage = messages[messages.length-1];    
    
    try {
        response = response.data.choices[0].message;
        console.log(response)

        res.status(200).json({data: response});

        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Check if chat data for domain already exists
        let ind = user.chatData.findIndex((chatData) => chatData.domain === domain);
        if (ind === -1) {
            user.chatData.push({ domain, chats: [] }); 
        }

     
        ind = user.chatData.findIndex((chatData) => chatData.domain === domain);
        user.chatData[ind].chats.push(currentMessage);
        user.chatData[ind].chats.push(response);
        
        await user.save();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

});

router.get("/history/:domain", async (req, res) => {
    const token = req.headers.authorization.split("Bearer")[1].trim();
    const domain = req.params.domain;

    console.log("[POST] domain : ", domain)

    const decodedToken = jwt.decode(token);
    const userid = decodedToken.id;
    
    try {
       
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Check if chat data for domain already exists
        let ind = user.chatData.findIndex((chatData) => chatData.domain == domain);    

        if(ind == -1) {
            res.status(200).json({ data: [] })
        } else {
            let chats = user.chatData[ind].chats;
            console.log("reached : ", chats, domain)
            res.status(200).json({ data: chats })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

});

router.delete("/history/:domain", async (req, res) => {
    const token = req.headers.authorization.split("Bearer")[1].trim();
    const domain = req.params.domain;
    console.log("[DELETE] domain : ", domain)
    const decodedToken = jwt.decode(token);
    const userid = decodedToken.id;
    
    try {
       
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Check if chat data for domain already exists
        let ind = user.chatData.findIndex((chatData) => chatData.domain === domain);    

        if(ind == -1) {
            res.status(200).json({ message: "No chats found" })
        } else {
            user.chatData[ind].chats = [];
            await user.save();

            res.status(200).json({ message: "Chats deleted" })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

});


module.exports = router;