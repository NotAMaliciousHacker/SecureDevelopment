const express = require('express');
const cors = require('cors');
const app = express();
const port = 7331;

// Configure CORS to allow requests from localhost:3001
const corsOptions = {
    origin: 'http://localhost:3000',
  };
  
app.use(cors(corsOptions));

// Simulated user database
const users = {
  '1': { name: 'Alice', email: 'alice@example.com', address: '123 Apple St', iban: 'DE89370400440532013000' },
  '2': { name: 'Bob', email: 'bob@example.com', address: '456 Berry Blvd', iban: 'DE89370400440532013001' },
  '3': { name: 'Charlie', email: 'charlie@example.com', address: '789 Cherry Cir', iban: 'DE89370400440532013002' },
};

app.get('/users/:id', (req, res) => {
    const user = users[req.params.id];
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});
    
    app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});