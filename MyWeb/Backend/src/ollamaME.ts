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
  const { prompt} = req.body;

  if (!prompt ) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: 'JMA',
      prompt,
      stream: false,
    });

    res.json({ response: response.data.response });
  } catch (error: any) {
    console.error('Ollama error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Ollama request failed' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});