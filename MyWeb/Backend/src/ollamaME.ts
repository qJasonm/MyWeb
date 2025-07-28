import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import * as express from 'express';


const app = express();
app.use(cors());
app.use(bodyParser.json());

const OLLAMA_URL = 'http://localhost:11434';

app.post('/api/chat', async (req, res) => {
  const { model = 'llama3.2', messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages array' });
  }

  try {
    const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model : "JMA",
      messages,
      stream: false,
    });

    const lastMessage = response.data.message?.content || 'No response.';
    
    res.json({ response: lastMessage });
  } catch (error: any) {
    console.error('Ollama error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Ollama request failed' });
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});