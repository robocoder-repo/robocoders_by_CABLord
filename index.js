const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

const API_URL = 'https://api.robocoders.ai';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let sessionId = '';

async function createSession() {
  try {
    const response = await axios.get(`${API_URL}/create-session`, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });
    sessionId = response.data.sid;
    console.log('Session created successfully.');
  } catch (error) {
    console.error('Error creating session:', error.message);
    process.exit(1);
  }
}

async function chat(prompt, agent) {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      sid: sessionId,
      prompt: prompt,
      agent: agent
    }, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });
    console.log('AI:', response.data);
  } catch (error) {
    console.error('Error in chat:', error.message);
  }
}

async function startChat() {
  await createSession();
  
  console.log('Welcome to Robocoders Chat!');
  console.log('Available agents: GeneralCodingAgent, RepoAgent, FrontEndAgent');
  
  rl.question('Which agent would you like to use? ', async (agent) => {
    console.log(`Using ${agent}. Type 'exit' to quit.`);
    
    const askQuestion = () => {
      rl.question('You: ', async (input) => {
        if (input.toLowerCase() === 'exit') {
          rl.close();
          return;
        }
        
        await chat(input, agent);
        askQuestion();
      });
    };
    
    askQuestion();
  });
}

startChat();
