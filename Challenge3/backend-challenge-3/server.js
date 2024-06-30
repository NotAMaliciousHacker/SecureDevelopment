const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const port = 7331;

// Configure CORS to allow requests from localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000',
  };
  
app.use(cors(corsOptions));

// Middleware to parse request body
app.use(express.json());

app.post('/execute', (req, res) => {
  const userInput = req.body.command;

  // Vulnerable exec command
  exec(`dig ${userInput}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error: ${error.message}`);
    }
    if (stderr) {
      return res.status(500).send(`Stderr: ${stderr}`);
    }
    res.send(`Output: ${stdout}`);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
