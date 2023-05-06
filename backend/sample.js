require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}))
  
const OPENAI_KEY = process.env.OPENAI_API_KEY;
console.log(OPENAI_KEY)


let messages = [
    {role: "user", content: "Hello !"}
]
const systemPrompt = "You are Jack, an enthusiastic, and an accurate chatbot. You will answer subsequent questions based on this domain : https://niituniversity.in/"
   
messages = [
    { role: "system", content: systemPrompt },
    ...messages
]

async function run() {
    let res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    })
    
    console.log("data : ", res.data.choices[0].message)
}

run()
